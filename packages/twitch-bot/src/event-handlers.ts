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
const JOIN_COMMAND = 'join';
const LEAVE_COMMAND = 'leave';

const sheikahSlateBotApiClient = new SheikahSlateBotInternalApiClient({
  client: createClient(createConfig({ baseUrl: BASE_API_URL, throwOnError: true })),
});

/**
 * Method to be called on app start to subscribe to all previously joined channels and the bot's own channel
 */
export const setupExistingSubscriptionsOnAppStart = async (conduitId: string): Promise<void> => {
  // Subscribe to bot's own channel manually
  await createChatMessageEventSubscription(TWITCH_BOT_USER_ID, conduitId);

  // Subscribe to all other channels in db. Not catching API call errors to fail fast in case of issues.
  const { data } = await sheikahSlateBotApiClient.listTwitchChannels();
  for (const twitchChannel of data.twitchChannels) {
    await createChatMessageEventSubscription(twitchChannel.twitchChannelId, conduitId);
  }
};

/**
 * Handle new !join commands in the bot's channel
 */
const handleNewChannelJoinRequest = async (
  chatMessageEvent: TwitchChatMessageEvent,
  conduitId: string,
): Promise<void> => {
  if (chatMessageEvent.broadcaster_user_id !== TWITCH_BOT_USER_ID) {
    console.error("Join function called for chat message outside of bot's channel");
    return;
  }

  const chatterUserId = chatMessageEvent.chatter_user_id;
  const chatterUserName = chatMessageEvent.chatter_user_name;

  let hasChannelAlreadyJoined: boolean;
  try {
    const { data } = await sheikahSlateBotApiClient.listTwitchChannels({
      query: { twitchChannelId: chatterUserId },
    });
    hasChannelAlreadyJoined = data.twitchChannels.length > 0;
  } catch (error) {
    console.error('Error occured while checking to see if channel has already joined:', error);
    await sendInternalErrorChatMessage(chatMessageEvent);
    return;
  }

  if (hasChannelAlreadyJoined) {
    console.log(`Join command called for already joined channel '${chatterUserName}'`);
    const errorChatMessage = `[Error] Channel '${chatterUserName}' is already in the list of joined channels. No action taken.`;
    await sendTwitchChatMessage(chatMessageEvent, errorChatMessage);
    return;
  }

  try {
    await createChatMessageEventSubscription(chatterUserId, conduitId);
    await sheikahSlateBotApiClient.addTwitchChannel({ body: { twitchChannelId: chatterUserId } });
  } catch (error) {
    console.error(`Error joining channel '${chatterUserName}':`, error);
    await sendInternalErrorChatMessage(chatMessageEvent);
    return;
  }

  console.log(`Joined channel: '${chatterUserName}'`);
  const joinChatMessage = `Successfully joined channel '${chatterUserName}'`;
  await sendTwitchChatMessage(chatMessageEvent, joinChatMessage);
};

/**
 * Common logic to handle removing and unsubscribing from a channel.
 * This is called for manual !leave commands in the bot channel and for subscription revocation messages from Twitch.
 */
export const leaveChannel = async (twitchChannelId: string): Promise<void> => {
  // There should only be one channel.chat.message subscription for this channel
  const existingSubscriptions = await twitchApiClient.eventSub.getSubscriptionsForUser(twitchChannelId);
  for (const subscription of existingSubscriptions.data) {
    await subscription.unsubscribe();
  }

  await sheikahSlateBotApiClient.removeTwitchChannel({ query: { twitchChannelId } });
};

/**
 * Handle !leave commands in the bot's channel
 */
const handleChannelLeaveRequest = async (chatMessageEvent: TwitchChatMessageEvent): Promise<void> => {
  if (chatMessageEvent.broadcaster_user_id !== TWITCH_BOT_USER_ID) {
    console.error("Leave function called for chat message outside of bot's channel");
    return;
  }

  const chatterUserId = chatMessageEvent.chatter_user_id;
  const chatterUserName = chatMessageEvent.chatter_user_name;

  let hasChannelAlreadyJoined: boolean;
  try {
    const { data } = await sheikahSlateBotApiClient.listTwitchChannels({
      query: { twitchChannelId: chatterUserId },
    });
    hasChannelAlreadyJoined = data.twitchChannels.length > 0;
  } catch (error) {
    console.error('Error occured while checking to see if channel has already joined:', error);
    await sendInternalErrorChatMessage(chatMessageEvent);
    return;
  }

  if (!hasChannelAlreadyJoined) {
    console.log(`Leave command called for channel '${chatterUserName}' that is not in DB.`);
    const errorChatMessage = `[Error] Channel '${chatterUserName}' not in list of joined channels. No action taken.`;
    await sendTwitchChatMessage(chatMessageEvent, errorChatMessage);
    return;
  }

  try {
    await leaveChannel(chatterUserId);
  } catch (error) {
    console.error(`Error leaving channel '${chatterUserName}':`, error);
    await sendInternalErrorChatMessage(chatMessageEvent);
    return;
  }

  console.log(`Left channel: '${chatterUserName}'`);
  await sendTwitchChatMessage(chatMessageEvent, `Successfully left channel '${chatterUserName}'`);
};

export const handleNewChatMessage = async (
  chatMessageEvent: TwitchChatMessageEvent,
  conduitId: string,
): Promise<void> => {
  const splitMessage = chatMessageEvent.message.text.split(' ');

  // First word in the text for a reply message is a ping mentioning the parent message's author
  const firstWordInMessage = (chatMessageEvent.reply ? splitMessage[1] : splitMessage[0]) as string;
  if (!firstWordInMessage.startsWith(COMMAND_PREFIX)) {
    return;
  }

  // Remove the prefix and convert to lowercase
  const command = firstWordInMessage.slice(1).toLowerCase();

  // Handle join/leave commands in bot channel
  if (chatMessageEvent.broadcaster_user_id === TWITCH_BOT_USER_ID) {
    if (command === JOIN_COMMAND) {
      await handleNewChannelJoinRequest(chatMessageEvent, conduitId);
      return;
    }

    if (command === LEAVE_COMMAND) {
      await handleChannelLeaveRequest(chatMessageEvent);
      return;
    }
  }

  // Query API for resource
  let apiResponse;
  try {
    apiResponse = await sheikahSlateBotApiClient.listResources({ query: { commandName: command } });
  } catch (error) {
    console.error("Error calling 'listResources':", error);
    return;
  }

  const resource = apiResponse.data.resources[0];
  if (resource === undefined) {
    console.log(`Command '${command}' not found (Channel: '${chatMessageEvent.broadcaster_user_name}')`);
    return;
  }

  // Send response to Twitch chat
  console.log(`Sending response for command '${command}' (Channel: '${chatMessageEvent.broadcaster_user_name}')`);
  await sendTwitchChatMessage(chatMessageEvent, resource.content);
};

// Utility methods
/**
 * Utility method to setup a new subscription to listen for new chat messages in the given user's channel
 */
const createChatMessageEventSubscription = async (userId: string, conduitId: string): Promise<void> => {
  await twitchApiClient.eventSub.createSubscription(
    CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_TYPE,
    CHANNEL_CHAT_MESSAGE_SUBSCRIPTION_DEFINITION_VERSION,
    {
      broadcaster_user_id: userId,
      user_id: TWITCH_BOT_USER_ID,
    },
    {
      method: 'conduit',
      conduit_id: conduitId,
    },
  );
};

/**
 * Utility method to send a response chat message and to log any errors seen
 *
 * @param originalChatMessageEvent The event object for the chat message that is being responded to
 * @param message The response to send
 */
const sendTwitchChatMessage = async (
  originalChatMessageEvent: TwitchChatMessageEvent,
  message: string,
): Promise<void> => {
  try {
    const responseChatMessage = await twitchApiClient.chat.sendChatMessageAsApp(
      TWITCH_BOT_USER_ID,
      originalChatMessageEvent.broadcaster_user_id,
      message,
      {
        replyParentMessageId: originalChatMessageEvent.message_id,
      },
    );

    if (!responseChatMessage.isSent) {
      console.error(
        `Failed to send chat message in channel '${originalChatMessageEvent.broadcaster_user_name}': ` +
          `[${responseChatMessage.dropReasonCode}] ${responseChatMessage.dropReasonMessage}`,
      );
    }
  } catch (error) {
    console.error(`Error sending chat message in channel '${originalChatMessageEvent.broadcaster_user_name}'`, error);
  }
};

/**
 * Utility method to send chat messages notifying users of InternalErrors
 * This is only intended to respond to messages in the bot's own channel, and only for internal bot commands.
 */
const sendInternalErrorChatMessage = async (originalChatMessageEvent: TwitchChatMessageEvent): Promise<void> => {
  if (originalChatMessageEvent.broadcaster_user_id !== TWITCH_BOT_USER_ID) {
    console.error("sendInternalErrorChatMessage called for chat message outside of bot's channel");
    return;
  }

  const internalErrorChatMessage = '[Error] Internal error while processing command. Please reach out to bot owner.';
  await sendTwitchChatMessage(originalChatMessageEvent, internalErrorChatMessage);
};
