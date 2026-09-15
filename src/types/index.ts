export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ChangeType = 'new' | 'modified' | 'deleted' | 'breaking';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type DeploymentStatus = 'success' | 'running' | 'failed' | 'pending_approval';

export type DocStatus = 'synchronized' | 'syncing' | 'outdated' | 'error';

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required: boolean;
  type: string;
  description: string;
  example?: string | number | boolean;
}

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  format?: string;
  description?: string;
  example?: any;
  children?: SchemaField[];
}

export interface EndpointResponse {
  statusCode: number;
  description: string;
  schema?: any;
  example?: any;
}

export interface ApiEndpoint {
  id: string;
  projectId: string;
  method: HttpMethod;
  path: string;
  group: string;
  summary: string;
  description: string;
  controller: string;
  sourceFile: string;
  lineNumber: number;
  authentication: 'None' | 'Bearer Token' | 'API Key' | 'OAuth 2.0';
  parameters: Parameter[];
  requestSchema?: {
    type: string;
    properties: Record<string, any>;
    required: string[];
    example?: any;
  };
  responses: EndpointResponse[];
  hash: string;
  discoveredAt: string;
  status: 'documented' | 'modified' | 'new' | 'breaking';
  sourceSnippet?: string;
}

export interface DiffFieldChange {
  field: string;
  changeType: 'added' | 'removed' | 'type_changed' | 'required_changed';
  oldValue?: string;
  newValue?: string;
  description: string;
}

export interface ApiChange {
  id: string;
  projectId?: string;
  endpoint: string;
  method: HttpMethod;
  changeType: ChangeType;
  severity: SeverityLevel;
  breaking: boolean;
  oldSchema?: any;
  newSchema?: any;
  beforePayload?: any;
  afterPayload?: any;
  description: string;
  commit: {
    hash: string;
    message: string;
    author: string;
    timestamp: string;
  };
  detectedAt: string;
  status: 'pending_approval' | 'approved' | 'deployed' | 'rejected';
  diffFields: DiffFieldChange[];
}

export interface AgentExecution {
  id: string;
  projectId: string;
  agent: string;
  agentRole: string;
  status: 'completed' | 'running' | 'pending' | 'warning' | 'failed';
  title: string;
  durationMs: number;
  startedAt: string;
  completedAt?: string;
  input: string;
  output: string;
  logs: string[];
}

export interface Deployment {
  id: string;
  deploymentNumber: number;
  projectId: string;
  commit: string;
  commitMessage: string;
  version: string;
  status: DeploymentStatus;
  documentationUrl: string;
  apisChanged: number;
  breakingCount: number;
  deployedAt: string;
  duration: string;
  environment: string;
  requiresApproval?: boolean;
}

export interface Project {
  id: string;
  name: string;
  repositoryUrl: string;
  branch: string;
  framework: string;
  language: string;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    timestamp: string;
  };
  apiCount: number;
  documentedCount: number;
  changesCount: number;
  breakingCount: number;
  documentationStatus: DocStatus;
  lastScan: string;
  lastDeployment: {
    status: DeploymentStatus;
    version: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiVersion {
  id: string;
  projectId: string;
  version: string;
  commit: string;
  createdAt: string;
  openapiDocument: any;
  summary: string;
}
