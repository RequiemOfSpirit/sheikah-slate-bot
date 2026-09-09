import { Client, Events, GatewayIntentBits, Guild, Interaction } from 'discord.js';
import { handleInteraction } from './event-handlers.ts';
import { DISCORD_BOT_TOKEN } from './utils/env.ts';

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds],
});

discordClient.once(Events.ClientReady, (client: Client<true>) => {
  console.log(`Discord bot ready. Logged in as ${client.user.tag}.`);
  console.log('Connected servers:', client.guilds.cache.map((guild: Guild) => guild.name).join(', '));
});
discordClient.on(Events.InteractionCreate, (interaction: Interaction) => void handleInteraction(interaction));
void discordClient.login(DISCORD_BOT_TOKEN);
