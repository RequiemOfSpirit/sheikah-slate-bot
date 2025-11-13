import { twitchApiClient } from './client/twitch-api-client.ts';
import { TwitchChatMessageEvent } from './connection/twitch-message-types.ts';
import { TwitchWebSocketClient } from './connection/twitch-websocket-client.ts';
import { handleNewChatMessage, setupSubscriptions } from './event-handlers.ts';

// Initial cleanup on app restart
const existingConduits = await twitchApiClient.eventSub.getConduits();
for (const conduit of existingConduits) {
  await conduit.delete();
}

// Conduit and websocket connection setup
const conduit = await twitchApiClient.eventSub.createConduit(1);

/**
 * Function to be called when the Twitch WebSocket connection is designated as "ready"
 *
 * @param sessionId Session ID returned by Twitch to be used to finish conduit setup
 */
const handleWebSocketConnectionReady = async (sessionId: string) => {
  // Finish conduit setup
  await twitchApiClient.eventSub.updateConduitShards(conduit.id, [
    {
      id: '0', // ID for the first and only shard
      transport: {
        method: 'websocket',
        session_id: sessionId,
      },
    },
  ]);

  // Setup channel subscriptions
  await setupSubscriptions(conduit.id);
};

const websocketClient = new TwitchWebSocketClient();
websocketClient.onConnectionReady((sessionId: string) => void handleWebSocketConnectionReady(sessionId));
websocketClient.onChatMessage(
  (chatMessageEvent: TwitchChatMessageEvent) => void handleNewChatMessage(chatMessageEvent),
);
websocketClient.open();
