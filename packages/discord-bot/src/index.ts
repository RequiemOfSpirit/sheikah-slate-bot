import { Client, Colors, EmbedBuilder, Events, GatewayIntentBits, Message } from 'discord.js';
import { SheikahSlateBotApiClient } from '@sheikah-slate-bot/api/client';
import { createClient, createConfig } from '@sheikah-slate-bot/api/client-utils';
import { BASE_API_URL, DISCORD_BOT_TOKEN } from './utils/env.ts';

const COMMAND_PREFIX = '!';

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const apiClient = new SheikahSlateBotApiClient({
  client: createClient(createConfig({ baseUrl: BASE_API_URL })),
});

discordClient.once(Events.ClientReady, (readyClient: Client<true>) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  console.log(readyClient.guilds);
});

discordClient.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(COMMAND_PREFIX)) {
    return;
  }

  // Remove the prefix, grab first word and convert to lowercase
  const command = message.content.slice(1).split(' ')[0].toLowerCase();

  // Query API for resource
  const apiResponse = await apiClient.getResources({ query: { commandName: command } });
  if (apiResponse.error) {
    console.error(apiResponse.error);
    return;
  }

  const resource = apiResponse.data?.resources[0];
  if (!resource) {
    console.log(`Command '${message.content}' not found`);
    return;
  }

  // Send discord response
  console.log(`Sending response for command '${message.content}'`);

  const discordReply = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(resource.title)
    .setDescription(resource.content);

  if (resource.commands.length > 1) {
    discordReply.setFooter({ text: `Aliases: ${resource.commands.join(', ')}` });
  }

  void message.reply({ embeds: [discordReply] });
});

void discordClient.login(DISCORD_BOT_TOKEN);
