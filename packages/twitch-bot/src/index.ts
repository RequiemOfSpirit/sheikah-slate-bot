import { twitchApiClient } from './client/twitch-api-client.ts';
import { TwitchChatMessageEvent } from './connection/twitch-message-types.ts';
import { TwitchWebSocketClient } from './connection/twitch-websocket-client.ts';
import { handleNewChatMessage, setupExistingSubscriptionsOnAppStart } from './event-handlers.ts';

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
 * @param sessionId Session ID returned by Twitch needed to finish conduit setup (or) update conduit shard on reconnect
 */
const handleNewSession = async (sessionId: string) => {
  await twitchApiClient.eventSub.updateConduitShards(conduit.id, [
    {
      id: '0', // ID for the first and only shard
      transport: {
        method: 'websocket',
        session_id: sessionId,
      },
    },
  ]);
};

const handleInitialConnectionReady = async () => {
  // Setup channel subscriptions
  await setupExistingSubscriptionsOnAppStart(conduit.id);
};

const websocketClient = new TwitchWebSocketClient({
  newSessionHandler: handleNewSession,
  initialConnectionReadyHandler: handleInitialConnectionReady,
  chatMessageHandler: async (chatMessageEvent: TwitchChatMessageEvent) =>
    await handleNewChatMessage(chatMessageEvent, conduit.id),
});

websocketClient.open();
