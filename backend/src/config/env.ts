import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export function requireMongoUri(): string {
  if (!env.mongoUri) throw new Error('MONGODB_URI is required');
  return env.mongoUri;
}