import { Colors, EmbedBuilder, Message } from 'discord.js';
import { createClient, createConfig } from '@sheikah-slate-bot/api/client-utils';
import { SheikahSlateBotInternalApiClient } from '@sheikah-slate-bot/api/client/internal';
import { BASE_API_URL } from './utils/env.ts';

const COMMAND_PREFIX = '!';

const apiClient = new SheikahSlateBotInternalApiClient({
  client: createClient(createConfig({ baseUrl: BASE_API_URL, throwOnError: true })),
});

export const handleNewMessage = async (message: Message): Promise<void> => {
  if (!message.content.startsWith(COMMAND_PREFIX)) {
    return;
  }

  // Remove the prefix, grab first word and convert to lowercase
  const command = (message.content.slice(1).split(' ')[0] as string).toLowerCase();

  // Query API for resource
  let apiResponse;
  try {
    apiResponse = await apiClient.listResources({ query: { commandName: command } });
  } catch (error) {
    console.error("[Error] Error calling 'listResources':", error);
    return;
  }

  const resource = apiResponse.data.resources[0];
  if (resource === undefined) {
    console.log(`Command '${command}' not found`);
    return;
  }

  // Send discord response
  console.log(`Sending response for command '${command}'`);

  const discordReply = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(resource.title)
    .setDescription(resource.content);

  if (resource.commands.length > 1) {
    discordReply.setFooter({ text: `Aliases: ${resource.commands.join(', ')}` });
  }

  void message.reply({ embeds: [discordReply] });
};
