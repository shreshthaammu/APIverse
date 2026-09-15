import { ApiVersion } from '../models/ApiVersion.js';
import { AgentExecution } from '../models/AgentExecution.js';
import { Deployment } from '../models/Deployment.js';
import { OpenApiDocument } from '../models/OpenApiDocument.js';

export const versions = (id: string) => ApiVersion.find({ projectId: id }).sort({ createdAt: -1 }).lean();
export const version = (id: string, versionId: string) => ApiVersion.findOne({ _id: versionId, projectId: id }).lean();
export const createVersion = (id: string, body: Record<string, unknown>) => ApiVersion.create({ ...body, projectId: id });
export const agents = (id: string) => AgentExecution.find({ projectId: id }).sort({ startedAt: -1 }).lean();
export const agent = (id: string, executionId: string) => AgentExecution.findOne({ _id: executionId, projectId: id }).lean();
export const createAgent = (id: string, body: Record<string, unknown>) => AgentExecution.create({ ...body, projectId: id });
export const deployments = (id: string) => Deployment.find({ projectId: id }).sort({ createdAt: -1 }).lean();
export const deployment = (id: string, deploymentId: string) => Deployment.findOne({ _id: deploymentId, projectId: id }).lean();
export const createDeployment = (id: string, body: Record<string, unknown>) => Deployment.create({ ...body, projectId: id, status: body.status || 'successful' });
export const getOpenApi = (id: string) => OpenApiDocument.findOne({ projectId: id }).sort({ updatedAt: -1 }).lean();
export const saveOpenApi = (id: string, document: unknown) => OpenApiDocument.findOneAndUpdate({ projectId: id }, { projectId: id, document }, { upsert: true, new: true, runValidators: true }).lean();
export async function scan(id: string) {
  const started = Date.now();
  const execution = await AgentExecution.create({ projectId: id, agent: 'Repository Scout', status: 'completed', input: 'Mock repository scan', output: 'No source analysis is enabled in Phase 2.', duration: 0, completedAt: new Date() });
  await execution.updateOne({ duration: Date.now() - started });
  return { status: 'completed', message: 'Repository scan completed', apisDiscovered: 0, executionId: execution.id };
}
export const scanStatus = (id: string) => AgentExecution.findOne({ projectId: id, agent: 'Repository Scout' }).sort({ startedAt: -1 }).lean();