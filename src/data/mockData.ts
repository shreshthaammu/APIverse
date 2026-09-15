import { Project, ApiEndpoint, ApiChange, AgentExecution, Deployment } from '../types';

export const initialProject: Project = {
  id: 'proj_demo_api',
  name: 'Demo API',
  repositoryUrl: 'https://github.com/apiverse-org/demo-express-api',
  branch: 'main',
  framework: 'Express + TypeScript',
  language: 'TypeScript 5.8',
  lastCommit: {
    hash: 'a83f9c2',
    message: 'feat(orders): update order schema and product route specs',
    author: 'alex.chen@devtools.io',
    timestamp: '2 minutes ago',
  },
  apiCount: 42,
  documentedCount: 39,
  changesCount: 3,
  breakingCount: 1,
  documentationStatus: 'synchronized',
  lastScan: '2 minutes ago',
  lastDeployment: {
    status: 'success',
    version: 'v1.4.0',
    timestamp: '2 minutes ago',
  },
  createdAt: '2026-08-10T14:30:00Z',
  updatedAt: '2026-09-14T22:30:00Z',
};

export const initialEndpoints: ApiEndpoint[] = [
  // Authentication
  {
    id: 'ep_auth_login',
    projectId: 'proj_demo_api',
    method: 'POST',
    path: '/api/auth/login',
    group: 'Authentication',
    summary: 'Authenticate user credentials',
    description: 'Validates user email and password, returning an access token and user profile.',
    controller: 'AuthController.login',
    sourceFile: 'src/routes/auth.routes.ts',
    lineNumber: 24,
    authentication: 'None',
    parameters: [],
    requestSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'developer@example.com' },
        password: { type: 'string', format: 'password', example: '••••••••••••' },
      },
      required: ['email', 'password'],
      example: {
        email: 'developer@example.com',
        password: 'SecurePassword123!',
      },
    },
    responses: [
      {
        statusCode: 200,
        description: 'Authentication successful',
        schema: {
          token: 'string',
          expiresIn: 'number',
          user: { id: 'string', email: 'string', role: 'string' },
        },
      },
      { statusCode: 401, description: 'Invalid email or password' },
      { statusCode: 429, description: 'Too many login attempts' },
    ],
    hash: 'h_auth_login_99f',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.post('/login', validate(loginSchema), AuthController.login);`,
  },
  {
    id: 'ep_auth_register',
    projectId: 'proj_demo_api',
    method: 'POST',
    path: '/api/auth/register',
    group: 'Authentication',
    summary: 'Register new account',
    description: 'Registers a new tenant user with cryptographic password hashing and activation email dispatch.',
    controller: 'AuthController.register',
    sourceFile: 'src/routes/auth.routes.ts',
    lineNumber: 48,
    authentication: 'None',
    parameters: [],
    requestSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Sarah Connor' },
        email: { type: 'string', format: 'email', example: 'sarah@sky.net' },
        password: { type: 'string', example: 'T800terminator!' },
      },
      required: ['name', 'email', 'password'],
    },
    responses: [
      { statusCode: 201, description: 'Account registered successfully' },
      { statusCode: 400, description: 'Email already registered or validation failed' },
    ],
    hash: 'h_auth_reg_12a',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.post('/register', validate(registerSchema), AuthController.register);`,
  },
  {
    id: 'ep_auth_me',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/auth/me',
    group: 'Authentication',
    summary: 'Get active session profile',
    description: 'Returns the currently authenticated user profile based on bearer token claims.',
    controller: 'AuthController.getProfile',
    sourceFile: 'src/routes/auth.routes.ts',
    lineNumber: 72,
    authentication: 'Bearer Token',
    parameters: [],
    responses: [
      { statusCode: 200, description: 'Authenticated user profile' },
      { statusCode: 401, description: 'Missing or expired token' },
    ],
    hash: 'h_auth_me_88c',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.get('/me', requireAuth, AuthController.getProfile);`,
  },

  // Users
  {
    id: 'ep_users_list',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/users',
    group: 'Users',
    summary: 'List all workspace users',
    description: 'Fetches paginated list of organization users with filtering by role and status.',
    controller: 'UserController.list',
    sourceFile: 'src/routes/users.routes.ts',
    lineNumber: 19,
    authentication: 'Bearer Token',
    parameters: [
      { name: 'page', in: 'query', required: false, type: 'integer', description: 'Page offset', example: 1 },
      { name: 'limit', in: 'query', required: false, type: 'integer', description: 'Records per page', example: 20 },
      { name: 'role', in: 'query', required: false, type: 'string', description: 'Filter by role', example: 'admin' },
    ],
    responses: [
      { statusCode: 200, description: 'List of users with pagination metadata' },
      { statusCode: 403, description: 'Insufficient permissions' },
    ],
    hash: 'h_users_list_45a',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.get('/', requireAuth, UserController.list);`,
  },
  {
    id: 'ep_users_get_id',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/users/{id}',
    group: 'Users',
    summary: 'Get user by identifier',
    description: 'Retrieves comprehensive user information including metadata and assigned permissions.',
    controller: 'UserController.getById',
    sourceFile: 'src/routes/users.routes.ts',
    lineNumber: 41,
    authentication: 'Bearer Token',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Unique user UUID', example: 'usr_892b11' },
    ],
    responses: [
      { statusCode: 200, description: 'User record' },
      { statusCode: 404, description: 'User not found' },
    ],
    hash: 'h_users_id_77d',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.get('/:id', requireAuth, UserController.getById);`,
  },
  {
    id: 'ep_users_create',
    projectId: 'proj_demo_api',
    method: 'POST',
    path: '/api/users',
    group: 'Users',
    summary: 'Create invite user',
    description: 'Invites a new member to the workspace with predefined system roles.',
    controller: 'UserController.create',
    sourceFile: 'src/routes/users.routes.ts',
    lineNumber: 64,
    authentication: 'Bearer Token',
    parameters: [],
    requestSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['member', 'admin', 'billing_manager'] },
      },
      required: ['email', 'role'],
    },
    responses: [
      { statusCode: 201, description: 'User created' },
      { statusCode: 400, description: 'Validation failed' },
    ],
    hash: 'h_users_create_55b',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.post('/', requireAuth, requireRole('admin'), UserController.create);`,
  },
  {
    id: 'ep_users_delete_id',
    projectId: 'proj_demo_api',
    method: 'DELETE',
    path: '/api/users/{id}',
    group: 'Users',
    summary: 'Deactivate or delete user account',
    description: 'Permanently deletes user record. Requires mandatory audit reason header in recent changes.',
    controller: 'UserController.delete',
    sourceFile: 'src/routes/users.routes.ts',
    lineNumber: 92,
    authentication: 'Bearer Token',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'User ID to remove' },
      { name: 'X-Reason-Code', in: 'header', required: true, type: 'string', description: 'Mandatory audit trail reason code' },
    ],
    responses: [
      { statusCode: 204, description: 'User deleted' },
      { statusCode: 400, description: 'Missing required header X-Reason-Code' },
      { statusCode: 404, description: 'User not found' },
    ],
    hash: 'h_users_del_33x',
    discoveredAt: '2026-09-14T10:21:00Z',
    status: 'breaking',
    sourceSnippet: `router.delete('/:id', requireAuth, requireAuditHeader, UserController.delete);`,
  },

  // Products
  {
    id: 'ep_products_list',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/products',
    group: 'Products',
    summary: 'Search catalog products',
    description: 'Searches product catalog with faceted attributes, inventory filters, and full text query.',
    controller: 'ProductController.list',
    sourceFile: 'src/routes/products.routes.ts',
    lineNumber: 15,
    authentication: 'None',
    parameters: [
      { name: 'q', in: 'query', required: false, type: 'string', description: 'Search term', example: 'mechanical keyboard' },
      { name: 'category', in: 'query', required: false, type: 'string', description: 'Category slug', example: 'hardware' },
      { name: 'inStock', in: 'query', required: false, type: 'boolean', description: 'Filter in-stock items', example: true },
    ],
    responses: [
      { statusCode: 200, description: 'Product search results' },
    ],
    hash: 'h_prod_list_01c',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.get('/', ProductController.list);`,
  },
  {
    id: 'ep_products_get_id',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/products/{id}',
    group: 'Products',
    summary: 'Retrieve product details',
    description: 'Fetches single item with pricing, inventory count, and technical specifications.',
    controller: 'ProductController.getById',
    sourceFile: 'src/routes/products.routes.ts',
    lineNumber: 38,
    authentication: 'None',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Product ID or SKU', example: 'prod_123' },
    ],
    responses: [
      {
        statusCode: 200,
        description: 'Product detail response. NOTICE: price field removed in latest commit, replaced by pricing object.',
        schema: {
          id: 'string',
          sku: 'string',
          title: 'string',
          pricing: { base: 'number', currency: 'string' },
        },
      },
      { statusCode: 404, description: 'Product not found' },
    ],
    hash: 'h_prod_id_82k',
    discoveredAt: '2026-09-14T10:20:00Z',
    status: 'breaking',
    sourceSnippet: `router.get('/:id', ProductController.getById);`,
  },

  // Orders
  {
    id: 'ep_orders_list',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/orders',
    group: 'Orders',
    summary: 'List user orders',
    description: 'Retrieves history of submitted purchases with statuses and delivery milestones.',
    controller: 'OrderController.list',
    sourceFile: 'src/routes/orders.routes.ts',
    lineNumber: 22,
    authentication: 'Bearer Token',
    parameters: [
      { name: 'status', in: 'query', required: false, type: 'string', description: 'Filter by order status' },
    ],
    responses: [
      { statusCode: 200, description: 'Orders list' },
    ],
    hash: 'h_orders_list_52p',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.get('/', requireAuth, OrderController.list);`,
  },
  {
    id: 'ep_orders_create',
    projectId: 'proj_demo_api',
    method: 'POST',
    path: '/api/orders',
    group: 'Orders',
    summary: 'Create a new order',
    description: 'Submits a new order transaction. Recently modified in backend source code to include deliveryAddress and customerNote.',
    controller: 'OrderController.create',
    sourceFile: 'src/routes/orders.routes.ts',
    lineNumber: 54,
    authentication: 'Bearer Token',
    parameters: [],
    requestSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'prod_123' },
        quantity: { type: 'integer', example: 2 },
        deliveryAddress: { type: 'string', example: 'Hyderabad, Hitec City 500081' },
        customerNote: { type: 'string', example: 'Leave package at front reception' },
      },
      required: ['productId', 'quantity', 'deliveryAddress'],
      example: {
        productId: 'prod_123',
        quantity: 2,
        deliveryAddress: 'Hyderabad',
        customerNote: 'Fragile equipment',
      },
    },
    responses: [
      { statusCode: 201, description: 'Order successfully created with orderId and payment intent.' },
      { statusCode: 400, description: 'Validation failed or missing required fields' },
      { statusCode: 401, description: 'Unauthorized access token' },
      { statusCode: 500, description: 'Internal server error processing inventory' },
    ],
    hash: 'h_orders_create_mod7',
    discoveredAt: '2026-09-14T10:21:10Z',
    status: 'modified',
    sourceSnippet: `router.post('/', requireAuth, validate(createOrderSchema), OrderController.create);`,
  },
  {
    id: 'ep_orders_get_id',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/orders/{id}',
    group: 'Orders',
    summary: 'Get order details by ID',
    description: 'Retrieves invoice, items list, tracking number, and real-time shipping carrier updates.',
    controller: 'OrderController.getById',
    sourceFile: 'src/routes/orders.routes.ts',
    lineNumber: 88,
    authentication: 'Bearer Token',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Order ID', example: 'ord_990142' },
    ],
    responses: [
      { statusCode: 200, description: 'Order details' },
      { statusCode: 404, description: 'Order not found' },
    ],
    hash: 'h_orders_id_44r',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.get('/:id', requireAuth, OrderController.getById);`,
  },

  // Payments
  {
    id: 'ep_payments_create',
    projectId: 'proj_demo_api',
    method: 'POST',
    path: '/api/payments',
    group: 'Payments',
    summary: 'Initialize payment transaction',
    description: 'Creates a payment intent with external gateway and returns client secret for confirmation.',
    controller: 'PaymentController.createPayment',
    sourceFile: 'src/routes/payments.routes.ts',
    lineNumber: 28,
    authentication: 'Bearer Token',
    parameters: [],
    requestSchema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', example: 'ord_990142' },
        amount: { type: 'number', example: 149.99 },
        currency: { type: 'string', example: 'USD' },
        paymentMethod: { type: 'string', enum: ['card', 'upi', 'bank_transfer'] },
      },
      required: ['orderId', 'amount', 'currency'],
    },
    responses: [
      { statusCode: 200, description: 'Payment intent initialized' },
      { statusCode: 400, description: 'Invalid amount or order already paid' },
    ],
    hash: 'h_pay_create_11v',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.post('/', requireAuth, PaymentController.createPayment);`,
  },
  {
    id: 'ep_payments_verify',
    projectId: 'proj_demo_api',
    method: 'POST',
    path: '/api/payments/verify',
    group: 'Payments',
    summary: 'Verify transaction signature',
    description: 'Verifies payment gateway signature and marks corresponding order as settled.',
    controller: 'PaymentController.verify',
    sourceFile: 'src/routes/payments.routes.ts',
    lineNumber: 62,
    authentication: 'Bearer Token',
    parameters: [],
    requestSchema: {
      type: 'object',
      properties: {
        paymentId: { type: 'string' },
        signature: { type: 'string' },
      },
      required: ['paymentId', 'signature'],
    },
    responses: [
      { statusCode: 200, description: 'Payment verified and settled' },
    ],
    hash: 'h_pay_ver_63z',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.post('/verify', requireAuth, PaymentController.verify);`,
  },

  // Health & System
  {
    id: 'ep_health_check',
    projectId: 'proj_demo_api',
    method: 'GET',
    path: '/api/health',
    group: 'Health',
    summary: 'System health check',
    description: 'Returns operational status of API gateway, database connectivity, and background workers.',
    controller: 'HealthController.check',
    sourceFile: 'src/routes/health.routes.ts',
    lineNumber: 10,
    authentication: 'None',
    parameters: [],
    responses: [
      { statusCode: 200, description: 'System operational' },
      { statusCode: 503, description: 'Service degraded' },
    ],
    hash: 'h_health_ok_00',
    discoveredAt: '2026-09-14T10:00:00Z',
    status: 'documented',
    sourceSnippet: `router.get('/health', HealthController.check);`,
  },
];

export const initialChanges: ApiChange[] = [
  {
    id: 'chg_orders_schema_add',
    projectId: 'proj_demo_api',
    endpoint: '/api/orders',
    method: 'POST',
    changeType: 'modified',
    severity: 'low',
    breaking: false,
    oldSchema: {
      productId: 'string (required)',
      quantity: 'number (required)',
    },
    newSchema: {
      productId: 'string (required)',
      quantity: 'number (required)',
      deliveryAddress: 'string (required)',
      customerNote: 'string (optional)',
    },
    description: 'Request schema changed: Added required field "deliveryAddress" and optional "customerNote".',
    commit: {
      hash: 'a83f9c2',
      message: 'feat(orders): add deliveryAddress and customerNote fields to order payload',
      author: 'alex.chen@devtools.io',
      timestamp: '2 minutes ago',
    },
    detectedAt: '10:21:14',
    status: 'deployed',
    diffFields: [
      {
        field: 'deliveryAddress',
        changeType: 'added',
        newValue: 'string (required)',
        description: 'New mandatory delivery destination field',
      },
      {
        field: 'customerNote',
        changeType: 'added',
        newValue: 'string (optional)',
        description: 'New optional special instructions field',
      },
    ],
  },
  {
    id: 'chg_products_price_removed',
    projectId: 'proj_demo_api',
    endpoint: '/api/products/{id}',
    method: 'GET',
    changeType: 'breaking',
    severity: 'high',
    breaking: true,
    oldSchema: {
      id: 'string',
      title: 'string',
      price: 'number',
      inventory: 'number',
    },
    newSchema: {
      id: 'string',
      title: 'string',
      pricing: { base: 'number', currency: 'string' },
      inventory: 'number',
    },
    description: 'Response field removed: "price". Consumers expecting numerical price field directly on product object will encounter unhandled errors.',
    commit: {
      hash: '9f104d8',
      message: 'refactor(catalog): replace flat price number with multi-currency pricing object',
      author: 'devin.reed@devtools.io',
      timestamp: '14 minutes ago',
    },
    detectedAt: '10:14:02',
    status: 'pending_approval',
    diffFields: [
      {
        field: 'price',
        changeType: 'removed',
        oldValue: 'number',
        description: 'Root price property removed from response body',
      },
      {
        field: 'pricing',
        changeType: 'added',
        newValue: 'object { base: number, currency: string }',
        description: 'Multi-currency structured object added',
      },
    ],
  },
  {
    id: 'chg_users_delete_header',
    projectId: 'proj_demo_api',
    endpoint: '/api/users/{id}',
    method: 'DELETE',
    changeType: 'breaking',
    severity: 'medium',
    breaking: true,
    oldSchema: {
      headers: ['Authorization'],
    },
    newSchema: {
      headers: ['Authorization', 'X-Reason-Code (required)'],
    },
    description: 'Mandatory header introduced: "X-Reason-Code". Client requests without this audit header will receive HTTP 400.',
    commit: {
      hash: '4e29b11',
      message: 'feat(compliance): require X-Reason-Code on user deletion for GDPR audit trail',
      author: 'compliance-lead@devtools.io',
      timestamp: '45 minutes ago',
    },
    detectedAt: '09:48:10',
    status: 'deployed',
    diffFields: [
      {
        field: 'headers.X-Reason-Code',
        changeType: 'added',
        newValue: 'string (mandatory)',
        description: 'Required audit header',
      },
    ],
  },
];

export const initialAgentExecutions: AgentExecution[] = [
  {
    id: 'exec_step_1',
    projectId: 'proj_demo_api',
    agent: 'Repository Scout',
    agentRole: 'Repository Architecture & Framework Inspector',
    status: 'completed',
    title: 'Framework & Route Directories Scanned',
    durationMs: 420,
    startedAt: '10:21:04',
    completedAt: '10:21:06',
    input: 'Repository branch: main (Commit a83f9c2)',
    output: 'Express 4.21 + TypeScript detected. 6 route files identified in src/routes/*.ts. Zod validation schemas located in src/schemas/*.ts.',
    logs: [
      'Git hook triggered from push event to refs/heads/main',
      'Cloned AST tree in memory cache: 24 TypeScript files (128 KB)',
      'Identified entry point: src/server.ts',
      'Detected Express Router instances mounted at /api prefix',
      'Detected Zod validation middleware: validate(schema)',
    ],
  },
  {
    id: 'exec_step_2',
    projectId: 'proj_demo_api',
    agent: 'API Discovery Agent',
    agentRole: 'Route Path & AST Extraction',
    status: 'completed',
    title: 'Discovered Modified Route: POST /api/orders',
    durationMs: 680,
    startedAt: '10:21:08',
    completedAt: '10:21:10',
    input: 'AST parsing router.post("/orders", validate(createOrderSchema), OrderController.create)',
    output: 'Extracted full route path /api/orders with HTTP method POST. Controller: OrderController.create (src/routes/orders.routes.ts:54).',
    logs: [
      'Traversed AST CallExpression for router.post',
      'Resolved parent route mounting: app.use("/api", router) -> /api/orders',
      'Extracted middleware chain: [requireAuth, validate(createOrderSchema)]',
      'Extracted auth requirement: Bearer Token',
    ],
  },
  {
    id: 'exec_step_3',
    projectId: 'proj_demo_api',
    agent: 'Schema Analysis Agent',
    agentRole: 'Type Inference & Payload Extraction',
    status: 'completed',
    title: 'Analyzed Request & Response Schemas',
    durationMs: 890,
    startedAt: '10:21:12',
    completedAt: '10:21:14',
    input: 'Zod schema createOrderSchema & TypeScript interface CreateOrderDTO',
    output: 'Found 2 added fields: deliveryAddress (string, required) and customerNote (string, optional). Existing: productId, quantity.',
    logs: [
      'Parsed Zod.object definition in src/schemas/order.schema.ts',
      'Field "deliveryAddress": type=string, minLength=5, required=true',
      'Field "customerNote": type=string, maxLength=500, required=false',
      'Matched against previous AST snapshot hash 7b1c4',
    ],
  },
  {
    id: 'exec_step_4',
    projectId: 'proj_demo_api',
    agent: 'Documentation Agent',
    agentRole: 'OpenAPI 3.1 Synthesis & Enrichment',
    status: 'completed',
    title: 'Generated OpenAPI 3.1 Specification',
    durationMs: 1150,
    startedAt: '10:21:14',
    completedAt: '10:21:16',
    input: 'Discovered routes and verified AST schema types',
    output: 'Generated OpenAPI 3.1 document with semantic summaries, response headers, realistic examples, and parameter constraints.',
    logs: [
      'Synthesized operationId: createOrder',
      'Formatted requestBody application/json with OpenAPI 3.1 schema',
      'Constructed realistic mock example payload with deliveryAddress="Hyderabad"',
      'Attached responses: 201 Created, 400 Bad Request, 401 Unauthorized, 500 Server Error',
    ],
  },
  {
    id: 'exec_step_5',
    projectId: 'proj_demo_api',
    agent: 'Review & Validator Agent',
    agentRole: 'OpenAPI Spec Quality & Syntax Gatekeeper',
    status: 'completed',
    title: 'OpenAPI 3.1 Validation Passed',
    durationMs: 310,
    startedAt: '10:21:16',
    completedAt: '10:21:17',
    input: 'Full OpenAPI document tree (42 paths, 18 schemas)',
    output: 'Validation PASSED. 0 syntax errors, 0 orphaned schemas, 0 duplicate path items. Valid against OpenAPI 3.1.0 schema.',
    logs: [
      'Executed schema compliance checks against OpenAPI v3.1.0 JSON schema',
      'Checked path item parameter uniqueness: verified',
      'Checked response status codes RFC compliance: verified',
      'Linting score: 100/100',
    ],
  },
  {
    id: 'exec_step_6',
    projectId: 'proj_demo_api',
    agent: 'Breaking Change Agent',
    agentRole: 'Semantic Diff & Consumer Impact Classifier',
    status: 'completed',
    title: 'Breaking Change Analysis Complete',
    durationMs: 540,
    startedAt: '10:21:17',
    completedAt: '10:21:18',
    input: 'Compare commit a83f9c2 vs previous commit 89f4b01',
    output: 'Classified: NON-BREAKING (Severity: LOW). Added required field "deliveryAddress" on POST endpoint (allowed under semantic version minor update v1.4.0).',
    logs: [
      'Diffed old vs new schemas for POST /api/orders',
      'Detected addition of deliveryAddress: string',
      'Safe for existing integrations if default or backward compatible',
      'Auto-deployment policy: GRANTED',
    ],
  },
  {
    id: 'exec_step_7',
    projectId: 'proj_demo_api',
    agent: 'Deployment Agent',
    agentRole: 'Documentation Publisher & CDN Invalidation',
    status: 'completed',
    title: 'Published Documentation v1.4.0',
    durationMs: 760,
    startedAt: '10:21:20',
    completedAt: '10:21:23',
    input: 'OpenAPI 3.1 bundle, build artifacts, Swagger UI bundle',
    output: 'Published live documentation to https://apiverse-docs.io/apiverse-org/demo-express-api. Edge cache purged.',
    logs: [
      'Created Deployment record #1042',
      'Updated public Swagger UI spec bundle',
      'Invalidated CDN cache (24 edge nodes)',
      'Sent sync notification to dashboard and GitHub commit status checks',
    ],
  },
];

export const initialDeployments: Deployment[] = [
  {
    id: 'dep_1042',
    deploymentNumber: 1042,
    projectId: 'proj_demo_api',
    commit: 'a83f9c2',
    commitMessage: 'feat(orders): update order schema with delivery address',
    version: '1.4.0',
    status: 'success',
    documentationUrl: 'https://apiverse-docs.io/apiverse-org/demo-express-api',
    apisChanged: 3,
    breakingCount: 0,
    deployedAt: '2 minutes ago',
    duration: '2.8s',
    environment: 'production',
  },
  {
    id: 'dep_1041',
    deploymentNumber: 1041,
    projectId: 'proj_demo_api',
    commit: '9f104d8',
    commitMessage: 'refactor(catalog): replace flat price number with multi-currency object',
    version: '1.3.9-rc1',
    status: 'pending_approval',
    documentationUrl: 'https://apiverse-docs.io/apiverse-org/demo-express-api/stg',
    apisChanged: 1,
    breakingCount: 1,
    deployedAt: '14 minutes ago',
    duration: '1.9s',
    environment: 'staging',
    requiresApproval: true,
  },
  {
    id: 'dep_1040',
    deploymentNumber: 1040,
    projectId: 'proj_demo_api',
    commit: '4e29b11',
    commitMessage: 'feat(compliance): require X-Reason-Code on user deletion',
    version: '1.3.8',
    status: 'success',
    documentationUrl: 'https://apiverse-docs.io/apiverse-org/demo-express-api',
    apisChanged: 2,
    breakingCount: 1,
    deployedAt: '45 minutes ago',
    duration: '3.1s',
    environment: 'production',
  },
  {
    id: 'dep_1039',
    deploymentNumber: 1039,
    projectId: 'proj_demo_api',
    commit: 'c0421e7',
    commitMessage: 'docs(auth): refresh OAuth bearer scopes and rate limits',
    version: '1.3.7',
    status: 'success',
    documentationUrl: 'https://apiverse-docs.io/apiverse-org/demo-express-api',
    apisChanged: 3,
    breakingCount: 0,
    deployedAt: '3 hours ago',
    duration: '2.4s',
    environment: 'production',
  },
];

export const sampleOpenApiYaml = `openapi: 3.1.0
info:
  title: Demo API
  summary: Autonomous Self-Updating Express API
  description: |
    Production REST API automatically synchronized from source code using APIverse AST Analyzer.
    Maintained autonomously with zero human documentation drift.
  version: 1.4.0
  contact:
    name: APIverse Engineering
    url: https://apiverse.dev
    email: support@apiverse.dev
servers:
  - url: https://api.demo-apiverse.io/v1
    description: Production Gateway
  - url: https://staging-api.demo-apiverse.io/v1
    description: Staging Environment
paths:
  /api/orders:
    post:
      tags:
        - Orders
      summary: Create a new order
      description: Submits a purchase order transaction. Updated automatically with deliveryAddress and customerNote.
      operationId: createOrder
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - productId
                - quantity
                - deliveryAddress
              properties:
                productId:
                  type: string
                  description: Unique product SKU or identifier
                  example: prod_123
                quantity:
                  type: integer
                  minimum: 1
                  description: Units requested
                  example: 2
                deliveryAddress:
                  type: string
                  description: Delivery shipping address (Added in commit a83f9c2)
                  example: Hyderabad, Hitec City 500081
                customerNote:
                  type: string
                  description: Optional delivery remarks
                  example: Leave at reception desk
      responses:
        '201':
          description: Order created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  orderId:
                    type: string
                    example: ord_990142
                  status:
                    type: string
                    example: processing
                  total:
                    type: number
                    example: 299.98
                  createdAt:
                    type: string
                    format: date-time
        '400':
          description: Validation error or missing required deliveryAddress
        '401':
          description: Missing or expired Bearer token
        '500':
          description: Internal processing failure

  /api/products/{id}:
    get:
      tags:
        - Products
      summary: Get product by ID
      description: Retrieves product details. Note breaking change on price structure.
      operationId: getProductById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: Unique product identifier
      responses:
        '200':
          description: Product details response
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  title:
                    type: string
                  pricing:
                    type: object
                    properties:
                      base:
                        type: number
                      currency:
                        type: string
                  inventory:
                    type: integer
        '404':
          description: Product not found

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
`;
