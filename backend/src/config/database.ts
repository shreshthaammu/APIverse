import mongoose from 'mongoose';
import { requireMongoUri } from './env.js';

export async function connectDatabase(): Promise<void> {
  console.log('[INFO] Connecting to MongoDB');
  await mongoose.connect(requireMongoUri());
  console.log('[INFO] MongoDB connected');
}

export async function closeDatabase(): Promise<void> {
  await mongoose.connection.close();
}