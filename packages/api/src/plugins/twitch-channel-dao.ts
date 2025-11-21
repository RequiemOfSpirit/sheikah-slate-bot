import { FastifyInstance, FastifyPluginDoneCallback, FastifyPluginOptions } from 'fastify';
import fastifyPlugin, { PluginMetadata } from 'fastify-plugin';
import { TwitchChannel } from '../model/index.ts';

declare module 'fastify' {
  interface FastifyInstance {
    twitchChannelDao: {
      /**
       * @returns List of all Twitch Channels in the database.
       */
      getTwitchChannels: () => Promise<TwitchChannel[]>;

      /**
       * Adds the specified new Twitch Channel to the database.
       *
       * @param twitchChannelId The Twitch internal ID of the Twitch Channel to add.
       */
      addTwitchChannel: (twitchChannelId: string) => Promise<void>;

      /**
       * Removes specified Twitch Channel from the database.
       *
       * @param twitchChannelId The Twitch internal ID of the Twitch Channel to remove.
       */
      removeTwitchChannel: (twitchChannelId: string) => Promise<void>;
    };
  }
}

const pluginMetadata: PluginMetadata = {
  name: 'twitch-channel-dao',
  dependencies: ['postgres-connector'],
};

export const twitchChannelDao = fastifyPlugin(
  (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: FastifyPluginDoneCallback) => {
    fastify.decorate('twitchChannelDao', {
      getTwitchChannels: async (): Promise<TwitchChannel[]> => {
        const query = 'SELECT id, twitch_channel_id as "twitchChannelId" FROM twitch_channels;';
        const { rows } = await fastify.pg.query(query);
        return rows as TwitchChannel[];
      },
      addTwitchChannel: async (twitchChannelId: string): Promise<void> => {
        const query = {
          text: 'INSERT INTO twitch_channels (twitch_channel_id) VALUES ($1);',
          values: [twitchChannelId],
        };
        await fastify.pg.query(query);
      },
      removeTwitchChannel: async (twitchChannelId: string): Promise<void> => {
        const query = {
          text: 'DELETE FROM twitch_channels WHERE twitch_channel_id = $1;',
          values: [twitchChannelId],
        };
        await fastify.pg.query(query);
      },
    });

    done();
  },
  pluginMetadata,
);
