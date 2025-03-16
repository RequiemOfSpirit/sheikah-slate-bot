import pg from 'pg';
import { Resource } from '@/model/resources';
import { DATABASE_URL } from '@/utils/env';

const { Pool } = pg;
const connectionPool = new Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 2000,
});

export const getResource = async (command: string): Promise<Resource | undefined> => {
  const query = {
    text: `
      SELECT
        resource.title AS title,
        resource.content AS content,
        array_agg(command.name) AS aliases
      FROM resources resource
      INNER JOIN commands command
        ON resource.id = command.resource_id
      WHERE resource.id = (
        SELECT resource_id
        FROM commands
        WHERE name = $1
      )
      GROUP BY resource.id;
    `,
    values: [command],
  };

  return await connectionPool.query(query).then((res) => res.rows[0] as Resource | undefined);
};

export const getResourceContent = async (command: string): Promise<string | undefined> => {
  const query = {
    text: `
      SELECT commands.content
      FROM commands
      INNER JOIN aliases
        ON commands.id = aliases.command_id
      WHERE aliases.name = $1;
    `,
    values: [command],
  };

  return await connectionPool.query(query).then((res) => res.rows[0] as string | undefined);
};
