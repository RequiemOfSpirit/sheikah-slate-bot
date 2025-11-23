import { FastifySchema, RouteGenericInterface } from 'fastify';
import Type, { type Static } from 'typebox';
import { TwitchChannelSchema } from '../../model/index.ts';

/* `GET /twitch-channels` schema */
const listTwitchChannelsResponseSchema = Type.Object({
  twitchChannels: Type.Array(TwitchChannelSchema),
});
export interface ListTwitchChannelsRouteInterface extends RouteGenericInterface {
  Reply: Static<typeof listTwitchChannelsResponseSchema>;
}
export const listTwitchChannelsSchema: FastifySchema = {
  operationId: 'listTwitchChannels',
  response: {
    200: listTwitchChannelsResponseSchema,
  },
};

/* `POST /twitch-channels` schema */
const addTwitchChannelBodySchema = Type.Object({
  twitchChannelId: Type.String(),
});
export interface AddTwitchChannelRouteInterface extends RouteGenericInterface {
  Body: Static<typeof addTwitchChannelBodySchema>;
}
export const addTwitchChannelSchema: FastifySchema = {
  operationId: 'addTwitchChannel',
  body: addTwitchChannelBodySchema,
};

/* `DELETE /twitch-channels` schema */
const removeTwitchChannelQueryStringSchema = Type.Object({
  twitchChannelId: Type.String(),
});
export interface RemoveTwitchChannelRouteInterface extends RouteGenericInterface {
  Querystring: Static<typeof removeTwitchChannelQueryStringSchema>;
}
export const removeTwitchChannelSchema: FastifySchema = {
  operationId: 'removeTwitchChannel',
  querystring: removeTwitchChannelQueryStringSchema,
};
