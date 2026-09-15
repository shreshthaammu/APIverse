export type DemoProject = {
  _id: string;
  name: string;
  repositoryUrl: string;
  branch: string;
  framework: string;
  language: string;
  apiCount: number;
  documentedCount: number;
  changesCount: number;
  breakingCount: number;
  documentationStatus: 'synchronized' | 'changes_detected' | 'out_of_sync' | 'error';
  lastScan: string;
  lastDeployment: { status: string; version: string; timestamp: string };
  lastCommit: { hash: string; message: string; author: string; timestamp: string };
  createdAt: string;
  updatedAt: string;
};

export type DemoApi = {
  _id: string;
  projectId: string;
  method: string;
  path: string;
  group: string;
  summary: string;
  description: string;
  controller: string;
  sourceFile: string;
  lineNumber: number;
  authentication: { type: string } | 'None';
  parameters: unknown[];
  requestSchema: unknown;
  responses: unknown[];
  hash: string;
  discoveredAt: string;
  status: string;
  sourceSnippet: string;
};

export type DemoChange = {
  _id: string;
  projectId: string;
  endpoint: string;
  method: string;
  changeType: string;
  severity: string;
  breaking: boolean;
  oldSchema: unknown;
  newSchema: unknown;
  description: string;
  commit: { hash: string; message: string; author: string; timestamp: string };
  detectedAt: string;
  status: string;
  diffFields: string[];
};

export type DemoAgentExecution = {
  _id: string;
  projectId: string;
  agent: string;
  agentRole: string;
  status: string;
  title: string;
  duration: number;
  startedAt: string;
  completedAt?: string;
  input: string;
  output: string;
  logs: string[];
};

export type DemoDeployment = {
  _id: string;
  projectId: string;
  deploymentNumber: number;
  commit: string;
  commitMessage: string;
  version: string;
  status: string;
  documentationUrl: string;
  apisChanged: number;
  breakingCount: number;
  createdAt: string;
  duration: string;
  environment: string;
  requiresApproval: boolean;
};

const now = new Date();
const iso = (offsetMinutes: number) => new Date(now.getTime() - offsetMinutes * 60 * 1000).toISOString();

export const demoState = {
  projects: [
    {
      _id: 'demo-project-1',
      name: 'Demo API',
      repositoryUrl: 'https://github.com/apiverse-org/demo-express-api',
      branch: 'main',
      framework: 'Express + TypeScript',
      language: 'TypeScript',
      apiCount: 42,
      documentedCount: 39,
      changesCount: 3,
      breakingCount: 1,
      documentationStatus: 'synchronized',
      lastScan: '2 minutes ago',
      lastDeployment: { status: 'successful', version: 'v1.4.0', timestamp: iso(2) },
      lastCommit: { hash: 'a83f9c2', message: 'feat: update API contracts', author: 'demo@apiverse.dev', timestamp: iso(3) },
      createdAt: iso(60),
      updatedAt: iso(2),
    },
  ] as DemoProject[],
  apis: [
    {
      _id: 'demo-api-1',
      projectId: 'demo-project-1',
      method: 'POST',
      path: '/api/orders',
      group: 'Orders',
      summary: 'Create order',
      description: 'Creates a new order entry.',
      controller: 'OrderController',
      sourceFile: 'src/routes/orders.ts',
      lineNumber: 42,
      authentication: { type: 'bearer' },
      parameters: [],
      requestSchema: { type: 'object', properties: { total: { type: 'number' } }, required: ['total'] },
      responses: [{ statusCode: 200, description: 'Order created' }],
      hash: 'hash-order-create',
      discoveredAt: iso(5),
      status: 'documented',
      sourceSnippet: 'router.post("/orders", createOrder);',
    },
    {
      _id: 'demo-api-2',
      projectId: 'demo-project-1',
      method: 'GET',
      path: '/api/products/{id}',
      group: 'Catalog',
      summary: 'Get product',
      description: 'Fetches product information by id.',
      controller: 'ProductController',
      sourceFile: 'src/routes/products.ts',
      lineNumber: 18,
      authentication: 'None',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestSchema: null,
      responses: [{ statusCode: 200, description: 'Product details' }],
      hash: 'hash-product-get',
      discoveredAt: iso(9),
      status: 'documented',
      sourceSnippet: 'router.get("/products/:id", getProduct);',
    },
  ] as DemoApi[],
  changes: [
    {
      _id: 'demo-change-1',
      projectId: 'demo-project-1',
      endpoint: '/api/orders',
      method: 'POST',
      changeType: 'modified',
      severity: 'MEDIUM',
      breaking: false,
      oldSchema: { type: 'object' },
      newSchema: { type: 'object', properties: { deliveryAddress: { type: 'string' } } },
      description: 'Request schema changed: Added required field "deliveryAddress" and optional "customerNote".',
      commit: { hash: 'a83f9c2', message: 'feat: update API contracts', author: 'demo@apiverse.dev', timestamp: iso(3) },
      detectedAt: iso(3),
      status: 'pending_approval',
      diffFields: ['deliveryAddress', 'customerNote'],
    },
    {
      _id: 'demo-change-2',
      projectId: 'demo-project-1',
      endpoint: '/api/products/{id}',
      method: 'GET',
      changeType: 'removed',
      severity: 'HIGH',
      breaking: true,
      oldSchema: { type: 'object', properties: { price: { type: 'number' } } },
      newSchema: { type: 'object', properties: {} },
      description: 'Response field removed: "price". Consumers expecting numerical price field directly on product object will encounter unhandled errors.',
      commit: { hash: '9f104d8', message: 'fix: simplify product payload', author: 'demo@apiverse.dev', timestamp: iso(10) },
      detectedAt: iso(10),
      status: 'pending_approval',
      diffFields: ['price'],
    },
  ] as DemoChange[],
  agentExecutions: [
    {
      _id: 'demo-agent-1',
      projectId: 'demo-project-1',
      agent: 'Repository Scout',
      agentRole: 'Repository Scout',
      status: 'completed',
      title: 'Repository Scout',
      duration: 420,
      startedAt: iso(15),
      completedAt: iso(15),
      input: 'Scan repository for API surface',
      output: 'Detected demo API inventory and contract changes.',
      logs: ['repository scan started', 'contract diff completed'],
    },
  ] as DemoAgentExecution[],
  deployments: [
    {
      _id: 'demo-deploy-1',
      projectId: 'demo-project-1',
      deploymentNumber: 4,
      commit: 'a83f9c2',
      commitMessage: 'feat: update API contracts',
      version: 'v1.4.0',
      status: 'successful',
      documentationUrl: 'https://example.com/docs',
      apisChanged: 2,
      breakingCount: 1,
      createdAt: iso(15),
      duration: '00:02:10',
      environment: 'production',
      requiresApproval: false,
    },
  ] as DemoDeployment[],
  openApiDocuments: [
    {
      projectId: 'demo-project-1',
      document: {
        openapi: '3.1.0',
        info: { title: 'Demo API', version: '1.4.0' },
        paths: {
          '/api/orders': { post: { responses: { '200': { description: 'Ok' } } } },
          '/api/products/{id}': { get: { responses: { '200': { description: 'Ok' } } } },
        },
      },
    },
  ],
};

export const isDemoMode = () => !process.env.MONGODB_URI;

export function getDemoProjectById(id: string) {
  return demoState.projects.find((project) => project._id === id) ?? demoState.projects[0] ?? null;
}

export function getDemoApiList(projectId: string) {
  return demoState.apis.filter((item) => item.projectId === projectId);
}

export function getDemoApiById(projectId: string, apiId: string) {
  return demoState.apis.find((item) => item.projectId === projectId && item._id === apiId) ?? null;
}

export function getDemoChangeList(projectId: string) {
  return demoState.changes.filter((item) => item.projectId === projectId);
}

export function getDemoChangeById(projectId: string, changeId: string) {
  return demoState.changes.find((item) => item.projectId === projectId && item._id === changeId) ?? null;
}

export function getDemoAgentList(projectId: string) {
  return demoState.agentExecutions.filter((item) => item.projectId === projectId);
}

export function getDemoAgentById(projectId: string, executionId: string) {
  return demoState.agentExecutions.find((item) => item.projectId === projectId && item._id === executionId) ?? null;
}

export function getDemoDeploymentList(projectId: string) {
  return demoState.deployments.filter((item) => item.projectId === projectId);
}

export function getDemoDeploymentById(projectId: string, deploymentId: string) {
  return demoState.deployments.find((item) => item.projectId === projectId && item._id === deploymentId) ?? null;
}

export function getDemoOpenApi(projectId: string) {
  return demoState.openApiDocuments.find((item) => item.projectId === projectId)?.document ?? null;
}
