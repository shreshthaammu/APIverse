import { ApiVersion } from '../models/ApiVersion.js';
import { AgentExecution } from '../models/AgentExecution.js';
import { Deployment } from '../models/Deployment.js';
import { OpenApiDocument } from '../models/OpenApiDocument.js';
import { demoState, getDemoAgentById, getDemoAgentList, getDemoDeploymentById, getDemoDeploymentList, getDemoOpenApi, isDemoMode } from '../config/demoData.js';

const demoExecution = {
  _id: 'demo-scan-1',
  projectId: 'demo-project-1',
  agent: 'Repository Scout',
  agentRole: 'Repository Scout',
  status: 'completed',
  title: 'Repository Scout',
  duration: 420,
  startedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  input: 'Mock repository scan',
  output: 'Demo mode enabled; no source analysis is enabled in this deployment.',
  logs: ['repository scan started', 'demo mode active'],
};

export const versions = (id: string) => isDemoMode() ? [] : ApiVersion.find({ projectId: id }).sort({ createdAt: -1 }).lean();
export const version = (id: string, versionId: string) => isDemoMode() ? null : ApiVersion.findOne({ _id: versionId, projectId: id }).lean();
export const createVersion = (id: string, body: Record<string, unknown>) => isDemoMode() ? { _id: `demo-version-${Date.now()}`, projectId: id, ...body } : ApiVersion.create({ ...body, projectId: id });
export const agents = (id: string) => isDemoMode() ? getDemoAgentList(id) : AgentExecution.find({ projectId: id }).sort({ startedAt: -1 }).lean();
export const agent = (id: string, executionId: string) => isDemoMode() ? getDemoAgentById(id, executionId) : AgentExecution.findOne({ _id: executionId, projectId: id }).lean();
export const createAgent = (id: string, body: Record<string, unknown>) => isDemoMode() ? { ...body, _id: `demo-agent-${Date.now()}`, projectId: id } : AgentExecution.create({ ...body, projectId: id });
export const deployments = (id: string) => isDemoMode() ? getDemoDeploymentList(id) : Deployment.find({ projectId: id }).sort({ createdAt: -1 }).lean();
export const deployment = (id: string, deploymentId: string) => isDemoMode() ? getDemoDeploymentById(id, deploymentId) : Deployment.findOne({ _id: deploymentId, projectId: id }).lean();
export const createDeployment = (id: string, body: Record<string, unknown>) => isDemoMode() ? { ...body, _id: `demo-deploy-${Date.now()}`, projectId: id, status: body.status || 'successful' } : Deployment.create({ ...body, projectId: id, status: body.status || 'successful' });
export const getOpenApi = (id: string) => isDemoMode() ? getDemoOpenApi(id) : OpenApiDocument.findOne({ projectId: id }).sort({ updatedAt: -1 }).lean();
export const saveOpenApi = (id: string, document: unknown) => isDemoMode() ? { projectId: id, document } : OpenApiDocument.findOneAndUpdate({ projectId: id }, { projectId: id, document }, { upsert: true, new: true, runValidators: true }).lean();
export async function scan(id: string) {
  if (isDemoMode()) {
    demoState.agentExecutions.unshift({ ...demoExecution, projectId: id, _id: `demo-scan-${Date.now()}` });
    return { status: 'completed', message: 'Repository scan completed', apisDiscovered: 0, executionId: 'demo-scan-1' };
  }

  const started = Date.now();
  const execution = await AgentExecution.create({ projectId: id, agent: 'Repository Scout', status: 'completed', input: 'Mock repository scan', output: 'No source analysis is enabled in Phase 2.', duration: 0, completedAt: new Date() });
  await execution.updateOne({ duration: Date.now() - started });
  return { status: 'completed', message: 'Repository scan completed', apisDiscovered: 0, executionId: execution.id };
}
export const scanStatus = (id: string) => isDemoMode() ? { ...demoExecution, projectId: id } : AgentExecution.findOne({ projectId: id, agent: 'Repository Scout' }).sort({ startedAt: -1 }).lean();