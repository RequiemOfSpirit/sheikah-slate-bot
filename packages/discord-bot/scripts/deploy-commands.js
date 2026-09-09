import { REST, Routes } from 'discord.js';
import { commands } from '../build/dist/commands.js';
import '@dotenvx/dotenvx/config';

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;
if (!DISCORD_BOT_TOKEN) {
  console.error('[Error] DISCORD_BOT_TOKEN environment variable not set');
  process.exit(1);
}
if (!DISCORD_CLIENT_ID) {
  console.error('[Error] DISCORD_CLIENT_ID environment variable not set');
  process.exit(1);
}

(async () => {
  try {
    if (!commands || commands.length === 0) {
      console.log('No commands found to deploy.');
      return;
    }

    const rest = new REST().setToken(DISCORD_BOT_TOKEN);
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: commands.map((command) => command.toJSON()),
    });

    console.log('Successfully deployed commands.');
  } catch (error) {
    console.error('Error deploying commands:', error);
    process.exit(1);
  }
})();
