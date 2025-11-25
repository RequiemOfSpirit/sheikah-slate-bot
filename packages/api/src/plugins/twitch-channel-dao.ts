import { FastifyInstance, FastifyPluginDoneCallback, FastifyPluginOptions } from 'fastify';
import fastifyPlugin, { PluginMetadata } from 'fastify-plugin';
import { TwitchChannel } from '../model/index.ts';

declare module 'fastify' {
  interface FastifyInstance {
    twitchChannelDao: {
      /**
       * @returns List of all Twitch Channels in the database.
       */
      listTwitchChannels: () => Promise<TwitchChannel[]>;

      /**
       * @param twitchChannelId The Twitch internal ID of the Twitch Channel to check
       * @returns Whether the specified twitchChannelId exists in the database
       */
      doesTwitchChannelExist: (twitchChannelId: string) => Promise<boolean>;

      /**
       * @returns Singleton list containing the TwitchChannel entry corresponding to the requested twitch channel id.
       *          Empty list if the twitch channel id is not present in the db.
       */
      queryTwitchChannelsByTwitchChannelId: (twitchChannelId: string) => Promise<TwitchChannel[]>;

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
      listTwitchChannels: async (): Promise<TwitchChannel[]> => {
        const query = 'SELECT id, twitch_channel_id as "twitchChannelId" FROM twitch_channels;';
        const { rows } = await fastify.pg.query(query);
        return rows as TwitchChannel[];
      },
      doesTwitchChannelExist: async (twitchChannelId: string): Promise<boolean> => {
        const query = {
          text: 'SELECT 1 FROM twitch_channels WHERE twitch_channel_id = $1;',
          values: [twitchChannelId],
        };
        const { rows } = await fastify.pg.query(query);
        return rows.length !== 0;
      },
      queryTwitchChannelsByTwitchChannelId: async (twitchChannelId: string): Promise<TwitchChannel[]> => {
        const query = {
          text: 'SELECT id, twitch_channel_id as "twitchChannelId" FROM twitch_channels WHERE twitch_channel_id = $1;',
          values: [twitchChannelId],
        };
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
