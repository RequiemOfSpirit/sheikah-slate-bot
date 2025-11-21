import { FastifyInstance } from 'fastify';
import { TwitchChannel } from '../../model/index.ts';
import {
  AddTwitchChannelRouteInterface,
  addTwitchChannelSchema,
  GetTwitchChannelsRouteInterface,
  getTwitchChannelsSchema,
  RemoveTwitchChannelRouteInterface,
  removeTwitchChannelSchema,
} from './schema.ts';

export const twitchChannelRoutes = (fastify: FastifyInstance) => {
  fastify.get<GetTwitchChannelsRouteInterface>('/', { schema: getTwitchChannelsSchema }, async () => {
    const twitchChannels: TwitchChannel[] = await fastify.twitchChannelDao.getTwitchChannels();
    return { twitchChannels };
  });

  fastify.post<AddTwitchChannelRouteInterface>('/', { schema: addTwitchChannelSchema }, async (request, reply) => {
    const twitchChannelId: string = request.body.twitchChannelId;
    await fastify.twitchChannelDao.addTwitchChannel(twitchChannelId);
    return reply.code(200).send();
  });

  fastify.delete<RemoveTwitchChannelRouteInterface>(
    '/',
    { schema: removeTwitchChannelSchema },
    async (request, reply) => {
      const twitchChannelId: string = request.query.twitchChannelId;
      await fastify.twitchChannelDao.removeTwitchChannel(twitchChannelId);
      return reply.code(200).send();
    },
  );
};
