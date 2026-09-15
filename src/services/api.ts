import { AgentExecution, ApiChange, ApiEndpoint, Deployment, Project } from '../types';

const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
type ApiResponse<T> = { success: boolean; data: T };
type BackendRecord = Record<string, any>;

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error(`Backend request failed: ${response.status}`);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) throw new Error('Backend returned an unsuccessful response');
  return payload.data;
}

const idOf = (value: unknown): string => String(value || '');
const dateOf = (value: unknown): string => value ? new Date(String(value)).toISOString() : new Date().toISOString();

function mapProject(item: BackendRecord): Project {
  return {
    id: idOf(item._id || item.id), name: item.name, repositoryUrl: item.repositoryUrl, branch: item.branch,
    framework: item.framework, language: item.language,
    lastCommit: item.lastCommit || { hash: 'unknown', message: 'No commit recorded', author: 'unknown', timestamp: dateOf(item.updatedAt) },
    apiCount: item.apiCount || 0, documentedCount: item.documentedCount || 0, changesCount: item.changesCount || 0,
    breakingCount: item.breakingCount || 0, documentationStatus: item.documentationStatus === 'out_of_sync' ? 'outdated' : (item.documentationStatus || 'synchronized'),
    lastScan: item.lastScan || 'Never', lastDeployment: item.lastDeployment || { status: 'pending', version: 'unreleased', timestamp: 'Never' },
    createdAt: dateOf(item.createdAt), updatedAt: dateOf(item.updatedAt),
  };
}

function mapEndpoint(item: BackendRecord, projectId: string): ApiEndpoint {
  return { id: idOf(item._id || item.id), projectId, method: item.method, path: item.path, group: item.group || 'API', summary: item.summary || `${item.method} ${item.path}`, description: item.description || '', controller: item.controller || 'Unknown', sourceFile: item.sourceFile || 'Unknown', lineNumber: item.lineNumber || 0, authentication: item.authentication?.type === 'bearer' ? 'Bearer Token' : (item.authentication || 'None'), parameters: item.parameters || [], requestSchema: item.requestSchema, responses: item.responses || (item.responseSchema ? [{ statusCode: 200, description: 'Successful response', schema: item.responseSchema }] : []), hash: item.hash || '', discoveredAt: dateOf(item.discoveredAt), status: item.status || 'documented', sourceSnippet: item.sourceSnippet };
}

function mapChange(item: BackendRecord, projectId: string): ApiChange {
  return { id: idOf(item._id || item.id), projectId, endpoint: item.endpoint, method: item.method || 'GET', changeType: item.changeType === 'added' ? 'new' : item.changeType, severity: String(item.severity || 'LOW').toLowerCase() as ApiChange['severity'], breaking: Boolean(item.breaking), oldSchema: item.oldSchema, newSchema: item.newSchema, description: item.description || '', commit: item.commit || { hash: '', message: '', author: '', timestamp: dateOf(item.detectedAt) }, detectedAt: dateOf(item.detectedAt), status: 'pending_approval', diffFields: item.diffFields || [] };
}

function mapAgent(item: BackendRecord, projectId: string): AgentExecution {
  return { id: idOf(item._id || item.id), projectId, agent: item.agent, agentRole: item.agent, status: item.status || 'pending', title: item.agent, durationMs: item.duration || 0, startedAt: dateOf(item.startedAt), completedAt: item.completedAt ? dateOf(item.completedAt) : undefined, input: typeof item.input === 'string' ? item.input : JSON.stringify(item.input || ''), output: typeof item.output === 'string' ? item.output : JSON.stringify(item.output || ''), logs: item.logs || [] };
}

function mapDeployment(item: BackendRecord, projectId: string): Deployment {
  return { id: idOf(item._id || item.id), deploymentNumber: item.deploymentNumber || 0, projectId, commit: item.commit || '', commitMessage: item.commitMessage || '', version: item.version || 'unreleased', status: item.status === 'successful' ? 'success' : (item.status || 'pending'), documentationUrl: item.documentationUrl || '', apisChanged: item.apisChanged || 0, breakingCount: item.breakingCount || 0, deployedAt: dateOf(item.createdAt), duration: item.duration || '', environment: item.environment || 'development', requiresApproval: item.requiresApproval };
}

export async function loadProjectData(): Promise<{ project: Project; endpoints: ApiEndpoint[]; changes: ApiChange[]; agentExecutions: AgentExecution[]; deployments: Deployment[] }> {
  const projects = await request<BackendRecord[]>('/api/projects');
  if (!projects.length) throw new Error('No backend projects found');
  const project = mapProject(projects[0]);
  const [apis, changes, agents, deployments] = await Promise.all([request<BackendRecord[]>(`/api/projects/${project.id}/apis`), request<BackendRecord[]>(`/api/projects/${project.id}/changes`), request<BackendRecord[]>(`/api/projects/${project.id}/agent-activity`), request<BackendRecord[]>(`/api/projects/${project.id}/deployments`)]);
  return { project, endpoints: apis.map((item) => mapEndpoint(item, project.id)), changes: changes.map((item) => mapChange(item, project.id)), agentExecutions: agents.map((item) => mapAgent(item, project.id)), deployments: deployments.map((item) => mapDeployment(item, project.id)) };
}