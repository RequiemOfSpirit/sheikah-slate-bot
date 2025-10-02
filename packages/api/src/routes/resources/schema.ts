import { FastifySchema, RouteGenericInterface } from 'fastify';
import Type, { type Static } from 'typebox';

const ResourceSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  content: Type.String(),
  commands: Type.Array(Type.String()),
});
export type ResourceSchemaType = Static<typeof ResourceSchema>;

/* `GET /resources` schema */
const getResourcesQueryStringSchema = Type.Object({
  commandName: Type.Optional(Type.String()),
});

const getResourcesResponseSchema = Type.Object({
  resources: Type.Array(ResourceSchema),
});

export interface GetResourcesRouteInterface extends RouteGenericInterface {
  Querystring: Static<typeof getResourcesQueryStringSchema>;
  Reply: Static<typeof getResourcesResponseSchema>;
}
export const getResourcesSchema: FastifySchema = {
  querystring: getResourcesQueryStringSchema,
  response: {
    200: getResourcesResponseSchema,
  },
};
