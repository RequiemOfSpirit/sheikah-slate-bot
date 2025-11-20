import { createClient, createConfig } from '@sheikah-slate-bot/api/client-utils';
import { SheikahSlateBotInternalApiClient } from '@sheikah-slate-bot/api/client/internal';
import { twitchApiClient } from './client/twitch-api-client.ts';
import {
  CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_DEFINITION_VERSION,
  CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE,
  TwitchChatMessageEvent,
} from './connection/twitch-message-types.ts';
import { BASE_API_URL, TWITCH_BOT_USER_ID } from './utils/env.ts';

const COMMAND_PREFIX = '!';

const sheikahSlateBotApiClient = new SheikahSlateBotInternalApiClient({
  client: createClient(createConfig({ baseUrl: BASE_API_URL })),
});

export const handleNewChatMessage = async (chatMessageEvent: TwitchChatMessageEvent): Promise<void> => {
  const splitMessage = chatMessageEvent.message.text.split(' ');

  // First word in the text for a reply message is a ping mentioning the parent message's author
  const firstWordInMessage = chatMessageEvent.reply ? splitMessage[1] : splitMessage[0];
  if (!firstWordInMessage.startsWith(COMMAND_PREFIX)) {
    return;
  }

  // Remove the prefix and convert to lowercase
  const command = firstWordInMessage.slice(1).toLowerCase();

  // Query API for resource
  const apiResponse = await sheikahSlateBotApiClient.getResources({ query: { commandName: command } });
  if (apiResponse.error) {
    console.error(apiResponse.error);
    return;
  }

  const resource = apiResponse.data?.resources[0];
  if (!resource) {
    console.log(`Command '${command}' not found (Channel: '${chatMessageEvent.broadcaster_user_name}')`);
    return;
  }

  // Send response to Twitch chat
  console.log(`Sending response for command '${command}' (Channel: '${chatMessageEvent.broadcaster_user_name}')`);

  // TODO: Capture response and log errors
  await twitchApiClient.chat.sendChatMessageAsApp(
    TWITCH_BOT_USER_ID,
    chatMessageEvent.broadcaster_user_id,
    resource.content,
    {
      replyParentMessageId: chatMessageEvent.message_id,
    },
  );
};

export const setupSubscriptions = async (conduitId: string): Promise<void> => {
  // Temporary hardcoded user ID for testing
  const TEST_USER_ID = '241965009';

  // TODO: Capture response and log errors
  await twitchApiClient.eventSub.createSubscription(
    CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE,
    CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_DEFINITION_VERSION,
    {
      broadcaster_user_id: TEST_USER_ID,
      user_id: TWITCH_BOT_USER_ID,
    },
    {
      method: 'conduit',
      conduit_id: conduitId,
    },
  );
};
