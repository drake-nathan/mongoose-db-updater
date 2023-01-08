import { createConnection } from 'mongoose';
import { projectSchema } from './schemas/project';
import { tokenSchema } from './schemas/token';
import { transactionSchema } from './schemas/transaction';
import { thumbnailSchema } from './schemas/thumbnail';
import { levelSnapshotSchema } from './schemas/levelSnapshot';

export const connectionFactory = async (dbConnectionString: string) => {
  const conn = await createConnection(dbConnectionString).asPromise();

  conn.addListener('error', (err) => {
    console.error('Error connecting to database', err);
  });

  conn.model('Project', projectSchema);
  conn.model('Token', tokenSchema);
  conn.model('Transaction', transactionSchema);
  conn.model('Thumbnail', thumbnailSchema);
  conn.model('LevelSnapshot', levelSnapshotSchema);

  return conn;
};
