import { twitchApiClient } from './client/twitch-api-client.ts';
import {
  CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_DEFINITION_VERSION,
  CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE,
  TwitchChatMessageEvent,
} from './connection/twitch-message-types.ts';
import { TWITCH_BOT_USER_ID } from './utils/env.ts';

const COMMAND_PREFIX = '!';

export const handleNewChatMessage = async (chatMessageEvent: TwitchChatMessageEvent): Promise<void> => {
  const splitMessage = chatMessageEvent.message.text.split(' ');

  // First word in the text for a reply message is a ping mentioning the parent message's author
  const firstWordInMessage = chatMessageEvent.reply ? splitMessage[1] : splitMessage[0];
  if (!firstWordInMessage.startsWith(COMMAND_PREFIX)) {
    return;
  }

  // Remove the prefix and convert to lowercase
  const command = firstWordInMessage.slice(1).toLowerCase();

  const tempResponse = `Response for command: '${command}'`;
  console.log(`Sending response for command '${command}'`);

  // TODO: Capture response and log errors
  await twitchApiClient.chat.sendChatMessageAsApp(
    TWITCH_BOT_USER_ID,
    chatMessageEvent.broadcaster_user_id,
    tempResponse,
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
