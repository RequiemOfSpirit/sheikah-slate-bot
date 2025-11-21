-- Up Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE twitch_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  twitch_channel_id VARCHAR(50) UNIQUE NOT NULL
);

-- Down Migration

DROP TABLE IF EXISTS twitch_channels;
