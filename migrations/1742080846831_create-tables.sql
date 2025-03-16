-- Up Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) UNIQUE NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE commands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  resource_id UUID NOT NULL,
  FOREIGN KEY (resource_id) REFERENCES resources(id)
);

-- Down Migration

DROP TABLE IF EXISTS commands;

DROP TABLE IF EXISTS resources;
