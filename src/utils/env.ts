import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export const { DISCORD_TOKEN, DATABASE_URL } = process.env;
