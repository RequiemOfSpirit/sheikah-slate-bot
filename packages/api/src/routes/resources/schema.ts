import { FastifySchema, RouteGenericInterface } from 'fastify';
import Type, { type Static } from 'typebox';
import { ResourceSchema } from '../../model/index.ts';

/* `GET /resources` schema */
const listResourcesQueryStringSchema = Type.Object({
  commandName: Type.Optional(Type.String()),
});
const listResourcesResponseSchema = Type.Object({
  resources: Type.Array(ResourceSchema),
});
export interface ListResourcesRouteInterface extends RouteGenericInterface {
  Querystring: Static<typeof listResourcesQueryStringSchema>;
  Reply: Static<typeof listResourcesResponseSchema>;
}
export const listResourcesSchema: FastifySchema = {
  operationId: 'listResources',
  querystring: listResourcesQueryStringSchema,
  response: {
    200: listResourcesResponseSchema,
  },
};
