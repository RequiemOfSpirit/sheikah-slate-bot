import {
  CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE,
  TwitchChatMessageEvent,
  TwitchWebSocketChatMessageSubscriptionNotificationMessage,
  TwitchWebSocketMessage,
  TwitchWebSocketSessionKeepaliveMessage,
  TwitchWebSocketSessionWelcomeMessage,
  TwitchWebSocketSubscriptionNotificationMessage,
  TwitchWebSocketSubscriptionRevocationMessage,
} from './twitch-message-types.ts';

type TwitchWebSocketConnectionReadyHandler = (sessionId: string) => void;
type TwitchChatMessageHandler = (chatMessageEvent: TwitchChatMessageEvent) => void;

const TWITCH_WEBSOCKET_SERVER_URL = 'wss://eventsub.wss.twitch.tv/ws';
const dummyEventHandler = () => {};

export class TwitchWebSocketClient {
  private readonly url: string;
  private webSocket: WebSocket | undefined;

  private handleConnectionReady: (sessionId: string) => void;
  private handleChatMessage: (chatMessageEvent: TwitchChatMessageEvent) => void;

  constructor(url = TWITCH_WEBSOCKET_SERVER_URL) {
    this.url = url;
    this.handleConnectionReady = dummyEventHandler;
    this.handleChatMessage = dummyEventHandler;
  }

  /**
   * Registers a handler for the `sessionId` returned in the welcome message sent by Twitch on connection establishment.
   * This handler should ideally be set before opening the connection with the `open` method.
   *
   * @param handler Function that receives connection session ID returned in Twitch's welcome message
   */
  onConnectionReady = (handler: TwitchWebSocketConnectionReadyHandler): void => {
    this.handleConnectionReady = handler;
  };

  /**
   * Registers a handler for incoming chat messages
   *
   * @param handler Function that handles incoming chat messages
   */
  onChatMessage = (handler: TwitchChatMessageHandler): void => {
    this.handleChatMessage = handler;
  };

  /**
   * Opens a connection to the Twitch WebSocket server
   */
  open = () => {
    this.webSocket = new WebSocket(this.url);

    this.webSocket.onopen = () => {
      console.log('WebSocket connection established');
    };
    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.webSocket.onclose = (event: CloseEvent) => {
      console.log('WebSocket connection closed:', event);
    };

    this.webSocket.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as TwitchWebSocketMessage;

      switch (message.metadata.message_type) {
        case 'session_welcome':
          this.handleWelcomeMessage(message as TwitchWebSocketSessionWelcomeMessage);
          break;
        case 'session_keepalive':
          // Do nothing
          break;
        case 'session_reconnect':
          this.handleSessionReconnectMessage(message as TwitchWebSocketSessionKeepaliveMessage);
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

  private handleWelcomeMessage = (message: TwitchWebSocketSessionWelcomeMessage): void => {
    const sessionId = message.payload.session.id;
    console.log('Received welcome message with Session ID:', sessionId);
    this.handleConnectionReady(sessionId);
  };

  private handleSessionReconnectMessage = (message: TwitchWebSocketSessionKeepaliveMessage): void => {
    // TODO: Implement this
    console.log('Received session reconnect message:', message);
  };

  private handleSubscriptionNotificationMessage = (message: TwitchWebSocketSubscriptionNotificationMessage): void => {
    // This app only handles chat message notifications
    if (message.payload.subscription.type !== CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE) {
      return;
    }

    const chatMessageNotificationMessage = message as TwitchWebSocketChatMessageSubscriptionNotificationMessage;
    this.handleChatMessage(chatMessageNotificationMessage.payload.event);
  };

  private handleSubscriptionRevocationMessage = (message: TwitchWebSocketSubscriptionRevocationMessage): void => {
    // TODO: Expose a hook here to allow removing channels. Raise error or warning for `version_removed` status.
    console.log('Received subscription revocation message:', message);
  };
}
