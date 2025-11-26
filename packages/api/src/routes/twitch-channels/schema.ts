import { FastifySchema, RouteGenericInterface } from 'fastify';
import Type, { type Static } from 'typebox';
import { TwitchChannelSchema } from '../../model/index.ts';

// Common shapes
const emptyResponseSchema = Type.Null();
const errorResponseSchema = Type.Object({
  statusCode: Type.String(),
  message: Type.String(),
});

/* `GET /twitch-channels` schema */
const listTwitchChannelsQueryStringSchema = Type.Object({
  twitchChannelId: Type.Optional(Type.String()),
});
const listTwitchChannelsResponseSchema = Type.Object({
  twitchChannels: Type.Array(TwitchChannelSchema),
});
export interface ListTwitchChannelsRouteInterface extends RouteGenericInterface {
  Querystring: Static<typeof listTwitchChannelsQueryStringSchema>;
  Reply: Static<typeof listTwitchChannelsResponseSchema>;
}
export const listTwitchChannelsSchema: FastifySchema = {
  operationId: 'listTwitchChannels',
  querystring: listTwitchChannelsQueryStringSchema,
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
  Reply: Static<typeof emptyResponseSchema> | Static<typeof errorResponseSchema>;
}
export const addTwitchChannelSchema: FastifySchema = {
  operationId: 'addTwitchChannel',
  body: addTwitchChannelBodySchema,
  response: {
    200: emptyResponseSchema,
    409: errorResponseSchema,
  },
};

/* `DELETE /twitch-channels` schema */
const removeTwitchChannelQueryStringSchema = Type.Object({
  twitchChannelId: Type.String(),
});
export interface RemoveTwitchChannelRouteInterface extends RouteGenericInterface {
  Querystring: Static<typeof removeTwitchChannelQueryStringSchema>;
  Reply: Static<typeof emptyResponseSchema> | Static<typeof errorResponseSchema>;
}
export const removeTwitchChannelSchema: FastifySchema = {
  operationId: 'removeTwitchChannel',
  querystring: removeTwitchChannelQueryStringSchema,
  response: {
    200: emptyResponseSchema,
    404: errorResponseSchema,
  },
};
