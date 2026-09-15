import { app } from './app.js';
import { connectDatabase, closeDatabase } from './config/database.js';
import { env } from './config/env.js';

async function start() {
  await connectDatabase();
  const server = app.listen(env.port, () => {
    console.log(`[INFO] Server running on port ${env.port}`);
    console.log('[INFO] Demo mode enabled: no MongoDB required');
  });

  const shutdown = async () => {
    await closeDatabase();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((error) => {
  console.error('[ERROR] Backend startup failed', error);
  process.exit(1);
});