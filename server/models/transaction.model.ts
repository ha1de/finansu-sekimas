import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface ITransaction extends Document {
  user: mongoose.Schema.Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

const transactionSchema = new Schema<ITransaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(TransactionType), required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String }
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);