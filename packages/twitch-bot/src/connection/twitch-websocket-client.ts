import {
  CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE,
  TwitchChatMessageEvent,
  TwitchWebSocketChatMessageSubscriptionNotificationMessage,
  TwitchWebSocketChatMessageSubscriptionRevocationMessage,
  TwitchWebSocketMessage,
  TwitchWebSocketSessionReconnectMessage,
  TwitchWebSocketSessionWelcomeMessage,
  TwitchWebSocketSubscriptionNotificationMessage,
  TwitchWebSocketSubscriptionRevocationMessage,
} from './twitch-message-types.ts';

type NewSessionHandler = (sessionId: string) => Promise<void>;
type InitialConnectionReadyHandler = () => Promise<void>;
type ChatMessageHandler = (chatMessageEvent: TwitchChatMessageEvent) => Promise<void>;
type SubscriptionRevocationHandler = (channelId: string) => Promise<void>;
type ConstructorParams = {
  /**
   * Optional websocket URL to connect to. Uses twitch's official websocket server URL if not provided.
   */
  url?: string;

  /**
   * Function that receives connection session ID returned in Twitch's welcome message on initial connect or reconnects
   */
  newSessionHandler: NewSessionHandler;

  /**
   * Function that is only called the first time a connection is successfully established
   */
  initialConnectionReadyHandler: InitialConnectionReadyHandler;

  /**
   * Function that handles incoming chat messages
   */
  chatMessageHandler: ChatMessageHandler;

  /**
   * Function that handles removing channels that get deleted or that revoke bot authorization
   */
  subscriptionRevocationHandler: SubscriptionRevocationHandler;
};

const TWITCH_WEBSOCKET_SERVER_URL = 'wss://eventsub.wss.twitch.tv/ws';

export class TwitchWebSocketClient {
  private readonly url: string;
  private oldWebSocket: WebSocket | undefined;
  private webSocket: WebSocket | undefined;

  private handleNewSession: NewSessionHandler;
  private handleInitialConnectionReady: InitialConnectionReadyHandler;
  private handleChatMessage: ChatMessageHandler;
  private handleSubscriptionRevocation: SubscriptionRevocationHandler;

  constructor({
    url,
    newSessionHandler,
    initialConnectionReadyHandler,
    chatMessageHandler,
    subscriptionRevocationHandler,
  }: ConstructorParams) {
    this.url = url ?? TWITCH_WEBSOCKET_SERVER_URL;
    this.handleNewSession = newSessionHandler;
    this.handleInitialConnectionReady = initialConnectionReadyHandler;
    this.handleChatMessage = chatMessageHandler;
    this.handleSubscriptionRevocation = subscriptionRevocationHandler;
  }

  /**
   * Opens a connection to the Twitch WebSocket server
   */
  open = (url = this.url) => {
    this.webSocket = new WebSocket(url);

    this.webSocket.onopen = () => {
      console.log('WebSocket connection established');
    };
    this.webSocket.onerror = (error) => {
      console.error('[Error] WebSocket error:', error);
    };
    this.webSocket.onclose = (event: CloseEvent) => {
      const closeTimestamp = new Date().toISOString();
      console.log(`[${closeTimestamp}] WebSocket connection closed:`, event);

      if (this.webSocket?.readyState === 3) {
        console.log('Current websocket closed without reconnect message. Establishing new connection.');
        this.oldWebSocket?.close();
        this.oldWebSocket = this.webSocket;
        this.open();
      }
    };

    this.webSocket.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as TwitchWebSocketMessage;

      switch (message.metadata.message_type) {
        case 'session_welcome': {
          if (this.oldWebSocket && this.oldWebSocket.readyState !== WebSocket.CLOSED) {
            console.log('New welcome message received. Closing old WebSocket connection.');
            this.oldWebSocket.close();
          }

          const isReconnect = !!this.oldWebSocket;
          void this.handleWelcomeMessage(message as TwitchWebSocketSessionWelcomeMessage, isReconnect);
          break;
        }
        case 'session_keepalive':
          // Do nothing
          break;
        case 'session_reconnect':
          this.handleSessionReconnectMessage(message as TwitchWebSocketSessionReconnectMessage);
          break;
        case 'notification':
          this.handleSubscriptionNotificationMessage(message as TwitchWebSocketSubscriptionNotificationMessage);
          break;
        case 'revocation':
          this.handleSubscriptionRevocationMessage(message as TwitchWebSocketSubscriptionRevocationMessage);
          break;
      }
    };
  };

  private handleWelcomeMessage = async (
    message: TwitchWebSocketSessionWelcomeMessage,
    isReconnect: boolean,
  ): Promise<void> => {
    const sessionId = message.payload.session.id;
    console.log('Received welcome message with Session ID:', sessionId);

    await this.handleNewSession(sessionId);
    if (!isReconnect) {
      await this.handleInitialConnectionReady();
    }
  };

  private handleSessionReconnectMessage = (message: TwitchWebSocketSessionReconnectMessage): void => {
    console.log('Received session reconnect message');

    // Maintain reference to old connection and open new connection with reconnect URL
    this.oldWebSocket = this.webSocket;
    this.open(message.payload.session.reconnect_url);
  };

  private handleSubscriptionNotificationMessage = (message: TwitchWebSocketSubscriptionNotificationMessage): void => {
    // This app only handles chat message subscriptions
    if (message.payload.subscription.type !== CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE) {
      return;
    }

    const chatMessageNotificationMessage = message as TwitchWebSocketChatMessageSubscriptionNotificationMessage;
    void this.handleChatMessage(chatMessageNotificationMessage.payload.event);
  };

  private handleSubscriptionRevocationMessage = (message: TwitchWebSocketSubscriptionRevocationMessage): void => {
    // This app only handles chat message subscriptions
    if (message.payload.subscription.type !== CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE) {
      console.error(
        `[Error] Received revocation message for non chat.message subscription '${message.payload.subscription.type}'`,
      );
      return;
    }

    const chatMessageRevocationMessage = message as TwitchWebSocketChatMessageSubscriptionRevocationMessage;

    const revocationStatus = chatMessageRevocationMessage.payload.subscription.status;
    if (revocationStatus === 'version_removed') {
      console.error('[Error] Received `version_removed` revovation message. Upgrade to new subscription version.');
      return;
    }

    const userChannelId = chatMessageRevocationMessage.payload.subscription.condition.broadcaster_user_id;
    console.log(
      `Received subscription revocation message with status '${revocationStatus}' for channel '${userChannelId}'`,
    );
    void this.handleSubscriptionRevocation(userChannelId);
  };
}
