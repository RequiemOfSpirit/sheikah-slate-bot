import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { TWITCH_APP_CLIENT_ID, TWITCH_APP_CLIENT_SECRET } from '../utils/env.ts';

const authProvider = new AppTokenAuthProvider(TWITCH_APP_CLIENT_ID, TWITCH_APP_CLIENT_SECRET);
export const twitchApiClient = new ApiClient({ authProvider });
