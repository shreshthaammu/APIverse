import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { projectRoutes } from './routes/projectRoutes.js';
import { apiRoutes } from './routes/apiRoutes.js';
import { changeRoutes } from './routes/changeRoutes.js';
import { resourceRoutes } from './routes/resourceRoutes.js';
import { openapiRoutes } from './routes/openapiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
export const app = express();
app.use(helmet()); app.use(cors({ origin: env.clientUrl })); app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'API Documentation Agent backend is running' }));
app.use('/api/projects', projectRoutes); app.use('/api/projects/:id/apis', apiRoutes); app.use('/api/projects/:id/changes', changeRoutes); app.use('/api/projects/:id', resourceRoutes); app.use('/api/openapi', openapiRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../dist');

app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
	if (req.path.startsWith('/api/')) {
		return next();
	}

	res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use(notFound); app.use(errorHandler);