import { FastifyInstance } from 'fastify';
import { TwitchChannel } from '../../model/index.ts';
import {
  AddTwitchChannelRouteInterface,
  addTwitchChannelSchema,
  ListTwitchChannelsRouteInterface,
  listTwitchChannelsSchema,
  RemoveTwitchChannelRouteInterface,
  removeTwitchChannelSchema,
} from './schema.ts';

export const twitchChannelRoutes = (fastify: FastifyInstance) => {
  fastify.get<ListTwitchChannelsRouteInterface>('/', { schema: listTwitchChannelsSchema }, async (request) => {
    const twitchChannelId: string | undefined = request.query.twitchChannelId;

    // List channels
    if (twitchChannelId === undefined) {
      const twitchChannels: TwitchChannel[] = await fastify.twitchChannelDao.listTwitchChannels();
      return { twitchChannels };
    }

    // Query for twitch channel by twitch channel id
    const singletonTwitchChannelList: TwitchChannel[] =
      await fastify.twitchChannelDao.queryTwitchChannelsByTwitchChannelId(twitchChannelId);
    return { twitchChannels: singletonTwitchChannelList };
  });

  fastify.post<AddTwitchChannelRouteInterface>('/', { schema: addTwitchChannelSchema }, async (request, reply) => {
    const twitchChannelId: string = request.body.twitchChannelId;
    if (await fastify.twitchChannelDao.doesTwitchChannelExist(twitchChannelId)) {
      return reply.code(409).send({ message: `Twitch Channel with ID '${twitchChannelId}' already exists.` });
    }

    await fastify.twitchChannelDao.addTwitchChannel(twitchChannelId);
    return reply.code(200).send();
  });

  fastify.delete<RemoveTwitchChannelRouteInterface>(
    '/',
    { schema: removeTwitchChannelSchema },
    async (request, reply) => {
      const twitchChannelId: string = request.query.twitchChannelId;
      if (!(await fastify.twitchChannelDao.doesTwitchChannelExist(twitchChannelId))) {
        return reply.code(404).send({ message: `Cannot find Twitch Channel with ID '${twitchChannelId}'.` });
      }

      await fastify.twitchChannelDao.removeTwitchChannel(twitchChannelId);
      return reply.code(200).send();
    },
  );
};
