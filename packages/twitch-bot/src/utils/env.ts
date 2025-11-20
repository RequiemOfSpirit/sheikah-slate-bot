import '@dotenvx/dotenvx/config';

// Ensure values are not undefined before exporting
const {
  TWITCH_APP_CLIENT_ID: CLIENT_ID_ENV_VAR,
  TWITCH_APP_CLIENT_SECRET: CLIENT_SECRET_ENV_VAR,
  TWITCH_BOT_USER_ID: BOT_USER_ID_ENV_VAR,
  BASE_API_URL,
} = process.env;

if (!CLIENT_ID_ENV_VAR || !CLIENT_SECRET_ENV_VAR || !BOT_USER_ID_ENV_VAR) {
  throw new Error('Unable to start. Missing required environment variables.');
}

export const TWITCH_APP_CLIENT_ID = CLIENT_ID_ENV_VAR;
export const TWITCH_APP_CLIENT_SECRET = CLIENT_SECRET_ENV_VAR;
export const TWITCH_BOT_USER_ID = BOT_USER_ID_ENV_VAR;
export { BASE_API_URL };
