# Backend API

The backend runs at `http://localhost:4000` by default. Responses use `{ success, data }` for successful requests and `{ success, error: { message, code } }` for errors.

## Core endpoints

- `GET /api/health`
- `POST|GET /api/projects`
- `GET|PUT|DELETE /api/projects/:id`
- `GET|POST /api/projects/:id/apis`
- `GET|PUT|DELETE /api/projects/:id/apis/:apiId`
- `GET|POST /api/projects/:id/changes`
- `GET /api/projects/:id/changes/:changeId`
- `GET|POST /api/projects/:id/versions` and `GET /api/projects/:id/versions/:versionId`
- `GET|POST /api/projects/:id/agent-activity` and `GET /api/projects/:id/agent-activity/:executionId`
- `POST /api/projects/:id/scan` and `GET /api/projects/:id/scan/status`
- `GET|POST /api/openapi/:projectId`
- `GET|POST /api/projects/:id/deployments` and `GET /api/projects/:id/deployments/:deploymentId`

## Examples

Create a project:

```json
POST /api/projects
{
  "name": "Demo API",
  "repositoryUrl": "https://github.com/example/demo-api",
  "branch": "main",
  "framework": "Express",
  "language": "TypeScript"
}
```

Health response:

```json
{ "status": "ok", "message": "API Documentation Agent backend is running" }
```

Changes support `type`, `severity`, and `breaking` query filters. Scan is intentionally a mock operation in Phase 2; AST discovery and automatic OpenAPI generation are future phases.