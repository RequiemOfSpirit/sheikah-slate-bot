-- Up Migration

-- Character limit for a Twitch message is 500, but Twitch includes `@username ` at the beginning
--  of a message when replying, which can, at worst, add 27 characters extra to any message.
ALTER TABLE resources ALTER COLUMN content TYPE VARCHAR(473);

-- Down Migration

ALTER TABLE resources ALTER COLUMN content TYPE TEXT;
