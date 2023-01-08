import { type Connection } from 'mongoose';
import { ProjectId, type ITransaction } from '../schemas/schemaTypes';

export const getLastTxProcessed = async (
  project_id: number,
  conn: Connection,
) => {
  const Transaction = conn.model<ITransaction>('Transaction');

  const query = await Transaction.findOne({ project_id })
    .sort('-block_number')
    .select('block_number');

  return query?.block_number || null;
};

export const getAllMintTransactions = async (
  project_id: number,
  conn: Connection,
) => {
  const Transaction = conn.model<ITransaction>('Transaction');

  const query = await Transaction.find({ project_id, event_type: 'Mint' });

  return query;
};

export const removeDuplicateTransactions = async (conn: Connection) => {
  const Transaction = conn.model<ITransaction>('Transaction');

  const query = await Transaction.aggregate([
    {
      $group: {
        _id: { transaction_hash: '$transaction_hash' },
        uniqueIds: { $addToSet: '$_id' },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gte: 2 } } },
  ]);

  const duplicateIds = query.map((q) => q.uniqueIds[1]);

  if (duplicateIds.length) {
    const { deletedCount } = await Transaction.deleteMany({
      _id: { $in: duplicateIds },
    });

    return deletedCount;
  }
  // else
  return 0;
};

export const getTxCounts = async (conn: Connection, project_id: number) => {
  const Transaction = conn.model<ITransaction>('Transaction');

  const query = await Transaction.find({ project_id });

  const txCounts = {
    total: query.length,
    mints: query.filter((tx) => tx.event_type === 'Mint').length,
    transfers: query.filter((tx) => tx.event_type === 'Transfer').length,
    customRules: query.filter((tx) => tx.event_type === 'CustomRule').length,
    levelShifts: query.filter((tx) => tx.event_type === 'ShiftLevel').length,
  };

  return txCounts;
};
