import { Client, Colors, EmbedBuilder, Events, GatewayIntentBits, Message } from 'discord.js';
import { config } from 'dotenv';
import { COMMANDS } from './test-commands.ts';

config();
const { DISCORD_TOKEN } = process.env;
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

client.on('messageCreate', (message: Message) => {
  console.log('New message: ', message.content);

  if (!message.content.startsWith(COMMAND_PREFIX)) {
    return;
  }

  // Remove the prefix, grab first word and convert to lowercase
  const command = message.content.slice(1).split(' ')[0].toLowerCase();
  const responseText: string | undefined = COMMANDS[command];
  if (!responseText) {
    return;
  }

  const response = new EmbedBuilder().setColor(Colors.Blue).setTitle(command).setDescription(responseText);
  void message.reply({ embeds: [response] });
});

void client.login(DISCORD_TOKEN);
