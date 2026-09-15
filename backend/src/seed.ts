import { connectDatabase, closeDatabase } from './config/database.js';
import { Project } from './models/Project.js';
import { ApiEndpoint } from './models/ApiEndpoint.js';
import { ApiChange } from './models/ApiChange.js';
import { AgentExecution } from './models/AgentExecution.js';
import { Deployment } from './models/Deployment.js';

async function seed() {
  await connectDatabase();
  const project = await Project.findOneAndUpdate({ repositoryUrl: 'https://github.com/apiverse-org/demo-express-api' }, { name: 'Demo API', repositoryUrl: 'https://github.com/apiverse-org/demo-express-api', branch: 'main', framework: 'Express + TypeScript', language: 'TypeScript', apiCount: 15, documentationStatus: 'synchronized', lastCommit: { hash: 'a83f9c2', message: 'feat: update API contracts', author: 'demo@apiverse.dev', timestamp: new Date() } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  await Promise.all([ApiEndpoint.deleteMany({ projectId: project.id }), ApiChange.deleteMany({ projectId: project.id }), AgentExecution.deleteMany({ projectId: project.id }), Deployment.deleteMany({ projectId: project.id })]);
  const paths = ['/api/auth/login', '/api/auth/register', '/api/auth/me', '/api/users', '/api/users/{id}', '/api/products', '/api/products/{id}', '/api/orders', '/api/orders/{id}', '/api/payments', '/api/health', '/api/teams', '/api/teams/{id}', '/api/search', '/api/notifications'];
  await ApiEndpoint.insertMany(paths.map((path, index) => ({ projectId: project.id, method: index % 3 === 0 ? 'POST' : 'GET', path, controller: 'DemoController', sourceFile: 'src/routes/demo.routes.ts', lineNumber: 20 + index, parameters: [], requestSchema: { type: 'object', properties: {}, required: [] }, responseSchema: { type: 'object' }, authentication: { required: index > 1, type: index > 1 ? 'bearer' : 'none' }, hash: `demo_${index}`, discoveredAt: new Date() })));
  await ApiChange.create({ projectId: project.id, endpoint: '/api/orders', changeType: 'modified', severity: 'MEDIUM', breaking: false, description: 'Order response includes delivery metadata.', commit: { hash: 'a83f9c2', message: 'feat: update order contracts', author: 'demo@apiverse.dev', timestamp: new Date() } });
  await AgentExecution.create({ projectId: project.id, agent: 'Repository Scout', status: 'completed', input: 'Seeded demo repository', output: '15 API endpoints available.', duration: 420, completedAt: new Date() });
  await Deployment.create({ projectId: project.id, commit: 'a83f9c2', version: 'v1.4.0', status: 'successful', documentationUrl: null, changes: [] });
  console.log(`[INFO] Seeded Demo API (${project.id})`);
  await closeDatabase();
}
seed().catch(async (error) => { console.error('[ERROR] Seed failed', error); await closeDatabase(); process.exit(1); });