import { Client, Events, GatewayIntentBits, Guild, Message } from 'discord.js';
import { handleNewMessage } from './event-handlers.ts';
import { DISCORD_BOT_TOKEN } from './utils/env.ts';

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discordClient.once(Events.ClientReady, (client: Client<true>) => {
  console.log(`Discord bot ready. Logged in as ${client.user.tag}.`);
  console.log('Connected servers:', client.guilds.cache.map((guild: Guild) => guild.name).join(', '));
});
discordClient.on('messageCreate', (message: Message) => void handleNewMessage(message));
void discordClient.login(DISCORD_BOT_TOKEN);
