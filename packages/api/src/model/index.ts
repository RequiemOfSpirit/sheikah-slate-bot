import Type, { Static } from 'typebox';

export const ResourceSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  content: Type.String(),
  commands: Type.Array(Type.String()),
});
export type Resource = Static<typeof ResourceSchema>;

export const TwitchChannelSchema = Type.Object({
  id: Type.String(),
  twitchChannelId: Type.String(),
});
export type TwitchChannel = Static<typeof TwitchChannelSchema>;
