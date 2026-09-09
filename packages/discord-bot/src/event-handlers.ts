import { ChatInputCommandInteraction, Colors, EmbedBuilder, Interaction } from 'discord.js';
import { createClient, createConfig } from '@sheikah-slate-bot/api/client-utils';
import { SheikahSlateBotInternalApiClient } from '@sheikah-slate-bot/api/client/internal';
import { INFO_COMMAND_OPTION_NAMES, infoCommand } from './commands.ts';
import { BASE_API_URL } from './utils/env.ts';

const RESOURCE_CONTENT_SEPARATOR = '|';

const apiClient = new SheikahSlateBotInternalApiClient({
  client: createClient(createConfig({ baseUrl: BASE_API_URL, throwOnError: true })),
});

export const handleInteraction = async (interaction: Interaction): Promise<void> => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  switch (interaction.commandName) {
    case infoCommand.name:
      await handleInfoCommand(interaction);
      return;
    default:
      console.warn(`Unknown command: ${interaction.commandName}`);
      return;
  }
};

const handleInfoCommand = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const command = interaction.options.getString(INFO_COMMAND_OPTION_NAMES.command, true).toLowerCase();
  const isPrivate = interaction.options.getBoolean(INFO_COMMAND_OPTION_NAMES.private) ?? false;

  // Query API for resource
  let apiResponse;
  try {
    apiResponse = await apiClient.listResources({ query: { commandName: command } });
  } catch (error) {
    console.error("[Error] Error calling 'listResources':", error);
    await interaction.reply({ content: 'Unable to retrieve resource. Report issue to bot owner.', ephemeral: true });
    return;
  }

  const resource = apiResponse.data.resources[0];
  if (resource === undefined) {
    console.log(`Command '${command}' not found`);
    await interaction.reply({ content: `Command '${command}' not found.`, ephemeral: true });
    return;
  }

  // Send discord response
  console.log(`Sending response for command '${command}' (private: ${isPrivate})`);

  const formattedResourceContent = resource.content
    .split(RESOURCE_CONTENT_SEPARATOR)
    .map((part) => part.trim())
    .join('\n');

  const discordReply = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(resource.title)
    .setDescription(formattedResourceContent);

  if (resource.commands.length > 1) {
    discordReply.setFooter({ text: `Aliases: ${resource.commands.join(', ')}` });
  }

  await interaction.reply({ embeds: [discordReply], ephemeral: isPrivate });
};
