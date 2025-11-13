export type TwitchWebSocketMessageBase = {
  metadata: {
    message_id: string;
    message_type: 'session_welcome' | 'session_reconnect' | 'session_keepalive' | 'notification' | 'revocation';
    message_timestamp: string;
  };
};

/* Session change message types */
type TwitchWebSocketSessionMessageBase = TwitchWebSocketMessageBase & {
  payload: {
    session: {
      id: string;
      connected_at: string;
    };
  };
};

export type TwitchWebSocketSessionWelcomeMessage = TwitchWebSocketSessionMessageBase & {
  metadata: {
    message_type: 'session_welcome';
  };
  payload: {
    session: {
      status: 'connected';
      keepalive_timeout_seconds: number;
    };
  };
};

export type TwitchWebSocketSessionReconnectMessage = TwitchWebSocketSessionMessageBase & {
  metadata: {
    message_type: 'session_reconnect';
  };
  payload: {
    session: {
      status: 'reconnecting';
      reconnect_url: string;
    };
  };
};

/* Keepalive message type */
export type TwitchWebSocketSessionKeepaliveMessage = TwitchWebSocketMessageBase & {
  metadata: {
    message_type: 'session_keepalive';
  };
};

/* Subscription related message types */
type TwitchWebSocketSubscriptionMessageBase = TwitchWebSocketMessageBase & {
  metadata: {
    subscription_type: string;
    subscription_version: string;
  };
  payload: {
    subscription: {
      id: string;
      type: string;
      version: string;
      cost: number;
      condition: object; // More specific types should override this based on the subscription type
      transport: {
        method: 'websocket';
        session_id: string;
      };
      created_at: string;
    };
  };
};

type TwitchWebSocketChatMessageSubscriptionMessageBase = TwitchWebSocketSubscriptionMessageBase & {
  metadata: {
    subscription_type: 'channel.chat.message';
  };
  payload: {
    subscription: {
      type: 'channel.chat.message';
      condition: {
        /**
         * 	The User ID of the channel to receive chat message events for.
         */
        broadcaster_user_id: string;
        /**
         * The User ID to read chat as.
         */
        user_id: string;
      };
    };
  };
};

// Generic types
export type TwitchWebSocketSubscriptionNotificationMessage = TwitchWebSocketSubscriptionMessageBase & {
  metadata: {
    message_type: 'notification';
  };
  payload: {
    subscription: {
      status: 'enabled';
    };
  };
};

export type TwitchWebSocketSubscriptionRevocationMessage = TwitchWebSocketSubscriptionMessageBase & {
  metadata: {
    message_type: 'revocation';
  };
  payload: {
    subscription: {
      status: 'authorization_revoked' | 'user_removed' | 'version_removed';
    };
  };
};

// Chat message specific types
export type TwitchChatMessageEvent = {
  // Does not include fields unnecessary to this app's functionality
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  /**
   * Broadcaster's display name with user-specified capitalization
   */
  broadcaster_user_name: string;
  chatter_user_id: string;
  chatter_user_login: string;
  /**
   * Chatter's display name with user-specified capitalization
   */
  chatter_user_name: string;
  message_id: string;
  message: {
    text: string;
  };
  reply: object | null; // We only need to know whether or not a message is a reply
};
export type TwitchWebSocketChatMessageSubscriptionNotificationMessage = TwitchWebSocketSubscriptionNotificationMessage &
  TwitchWebSocketChatMessageSubscriptionMessageBase & {
    payload: {
      event: TwitchChatMessageEvent;
    };
  };

export type TwitchWebSocketChatMessageSubscriptionRevocationMessage = TwitchWebSocketSubscriptionRevocationMessage &
  TwitchWebSocketChatMessageSubscriptionMessageBase;

/* Union Type for all Twitch WebSocket Messages */
export type TwitchWebSocketMessage =
  | TwitchWebSocketSessionWelcomeMessage
  | TwitchWebSocketSessionKeepaliveMessage
  | TwitchWebSocketSubscriptionNotificationMessage
  | TwitchWebSocketSessionReconnectMessage
  | TwitchWebSocketSubscriptionRevocationMessage;

/* Subscription type constants */
export const CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE = 'channel.chat.message';
export const CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_DEFINITION_VERSION = '1';
