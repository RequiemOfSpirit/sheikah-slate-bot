import { Client, Colors, EmbedBuilder, Events, GatewayIntentBits, Message } from 'discord.js';
import { getResource, Resource } from '@sheikah-slate-bot/db';
import { DISCORD_TOKEN } from './utils/env.ts';

const COMMAND_PREFIX = '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient: Client<true>) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  console.log(readyClient.guilds);
});

client.on('messageCreate', async (message: Message) => {
  if (!message.content.startsWith(COMMAND_PREFIX)) {
    return;
  }

  console.log('Processing command: ', message.content);

  // Remove the prefix, grab first word and convert to lowercase
  const command = message.content.slice(1).split(' ')[0].toLowerCase();
  const resource: Resource | undefined = await getResource(command);
  if (!resource) {
    return;
  }

  const response = new EmbedBuilder().setColor(Colors.Blue).setTitle(resource.title).setDescription(resource.content);
  if (resource.aliases.length > 1) {
    response.setFooter({ text: `Aliases: ${resource.aliases.join(', ')}` });
  }
  void message.reply({ embeds: [response] });
});

void client.login(DISCORD_TOKEN);
