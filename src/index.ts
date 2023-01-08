import * as dotenv from 'dotenv';
import { type Connection } from 'mongoose';
import { updateTokenUrls } from './currentJob';
import { connectionFactory } from './db/connectionFactory';

const main = async (env: 'local' | 'prod') => {
  dotenv.config();
  const dbConnectionStrings = {
    local: process.env.DB_CONNECTION_STRING_LOCAL,
    prod: process.env.DB_CONNECTION_STRING_PROD,
  };
  const dbConnectionString = dbConnectionStrings[env];

  if (!dbConnectionString)
    throw new Error('Problem getting database connection string from .env.');

  let conn: Connection | undefined;

  try {
    conn = await connectionFactory(dbConnectionString);
    if (!conn) throw new Error('Could not connect to database');
    else console.info('Connected to database');

    const numOfUpdatedTokens = await updateTokenUrls(conn, env);

    console.info(`Updated ${numOfUpdatedTokens} tokens.`);
  } catch (error) {
    console.error(error);
  } finally {
    if (conn) await conn.close();

    if (conn?.readyState === 0) console.info('Disconnected from database');
    else console.error('Could not disconnect from database');
  }
};

main('prod');
