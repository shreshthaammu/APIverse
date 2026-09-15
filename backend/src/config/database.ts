import mongoose from 'mongoose';
import { env, requireMongoUri } from './env.js';

export async function connectDatabase(): Promise<void> {
  if (!env.mongoUri) {
    console.log('[INFO] No MONGODB_URI configured; starting in demo mode');
    return;
  }

  console.log('[INFO] Connecting to MongoDB');
  await mongoose.connect(requireMongoUri());
  console.log('[INFO] MongoDB connected');
}

export async function closeDatabase(): Promise<void> {
  if (!env.mongoUri) return;
  await mongoose.connection.close();
}