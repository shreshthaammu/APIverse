import React, { useState } from 'react';
import { ApiEndpoint } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CodeBlock } from '../components/CodeBlock';
import {
  ArrowLeft,
  Lock,
  Code2,
  FileCode2,
  History,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Send,
  X,
} from 'lucide-react';

interface ApiDetailsPageProps {
  endpoint: ApiEndpoint;
  onBack: () => void;
  onNavigateToChanges: () => void;
}

export const ApiDetailsPage: React.FC<ApiDetailsPageProps> = ({
  endpoint,
  onBack,
  onNavigateToChanges,
}) => {
  const [modalMode, setModalMode] = useState<'none' | 'source' | 'openapi' | 'history'>('none');

  const openapiSnippet = `
paths:
  '${endpoint.path}':
    ${endpoint.method.toLowerCase()}:
      summary: ${endpoint.summary}
      description: ${endpoint.description}
      operationId: ${endpoint.controller.replace('.', '_')}
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: ${JSON.stringify(endpoint.requestSchema?.required || [])}
              properties:
${Object.entries(endpoint.requestSchema?.properties || {})
  .map(([k, v]: [string, any]) => `                ${k}:\n                  type: ${v.type || 'string'}`)
  .join('\n')}
      responses:
${endpoint.responses.map((r) => `        '${r.statusCode}':\n          description: ${r.description}`).join('\n')}
`.trim();

  return (
    <div className="space-y-6 pb-12">
      {/* Top back navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to API Explorer</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalMode('source')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>View Source</span>
          </button>
          <button
            onClick={() => setModalMode('openapi')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>View OpenAPI</span>
          </button>
          <button
            onClick={() => setModalMode('history')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>View Change History</span>
          </button>
        </div>
      </div>

      {/* Main Endpoint Summary Card */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge type="method" value={endpoint.method} size="lg" />
            <h1 className="text-lg font-mono font-bold text-zinc-100">{endpoint.path}</h1>
          </div>

          <div className="flex items-center gap-2">
            {endpoint.status === 'modified' && <StatusBadge type="change" value="modified" size="md" />}
            {endpoint.status === 'breaking' && <StatusBadge type="change" value="breaking" size="md" />}
            <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
              {endpoint.controller}
            </span>
          </div>
        </div>

        <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">{endpoint.description}</p>

        {/* Metadata pills */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">Authentication:</span>
            <span className="font-medium text-zinc-200 flex items-center gap-1">
              {endpoint.authentication !== 'None' && <Lock className="w-3 h-3 text-emerald-400" />}
              {endpoint.authentication}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">Source:</span>
            <span className="font-mono text-zinc-300">
              {endpoint.sourceFile}:{endpoint.lineNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">OAS Group:</span>
            <span className="font-medium text-zinc-200">{endpoint.group}</span>
          </div>
        </div>
      </div>

      {/* Request Body & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Request specifications */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Request Payload (JSON)
            </h3>
            {endpoint.requestSchema ? (
              <div className="space-y-3">
                <CodeBlock
                  code={JSON.stringify(endpoint.requestSchema.example || endpoint.requestSchema, null, 2)}
                  language="json"
                  title="Payload Example"
                  maxHeight="240px"
                />

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Schema Definition
                  </div>
                  <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                        <tr>
                          <th className="p-2">Property</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                        {Object.entries(endpoint.requestSchema.properties || {}).map(([key, prop]: [string, any]) => {
                          const isReq = endpoint.requestSchema?.required?.includes(key);
                          return (
                            <tr key={key} className="hover:bg-zinc-900/40">
                              <td className="p-2 font-semibold text-zinc-100">{key}</td>
                              <td className="p-2 text-blue-400">{prop.type}</td>
                              <td className="p-2">
                                {isReq ? (
                                  <span className="text-rose-400 font-semibold text-[11px]">required</span>
                                ) : (
                                  <span className="text-zinc-500 text-[11px]">optional</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-zinc-500 text-xs font-mono">
                No request body payload expected.
              </div>
            )}
          </div>

          {/* Parameters */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Parameters
            </h3>
            {endpoint.parameters.length > 0 ? (
              <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <tr>
                      <th className="p-2">Parameter</th>
                      <th className="p-2">In</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {endpoint.parameters.map((p) => (
                      <tr key={p.name} className="hover:bg-zinc-900/40">
                        <td className="p-2 font-semibold text-zinc-100">{p.name}</td>
                        <td className="p-2 text-zinc-400">{p.in}</td>
                        <td className="p-2 text-blue-400">{p.type}</td>
                        <td className="p-2">
                          {p.required ? (
                            <span className="text-rose-400 font-semibold text-[11px]">Yes</span>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 font-mono">Parameters: None</p>
            )}
          </div>
        </div>

        {/* Right: Response status codes */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Responses
            </h3>

            <div className="space-y-2">
              {endpoint.responses.map((res) => (
                <div
                  key={res.statusCode}
                  className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex items-start gap-3"
                >
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      res.statusCode >= 200 && res.statusCode < 300
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : res.statusCode === 400
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : res.statusCode === 401
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {res.statusCode}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-zinc-200">
                      {res.statusCode === 200
                        ? 'OK'
                        : res.statusCode === 201
                        ? 'Created'
                        : res.statusCode === 400
                        ? 'Bad Request'
                        : res.statusCode === 401
                        ? 'Unauthorized'
                        : 'Internal Server Error'}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">{res.description}</div>
                    {res.schema && (
                      <div className="mt-2">
                        <CodeBlock
                          code={JSON.stringify(res.schema, null, 2)}
                          language="json"
                          maxHeight="160px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog for View Source / View OpenAPI / View Change History */}
      {modalMode !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                {modalMode === 'source' && <Code2 className="w-4 h-4 text-blue-400" />}
                {modalMode === 'openapi' && <FileCode2 className="w-4 h-4 text-emerald-400" />}
                {modalMode === 'history' && <History className="w-4 h-4 text-amber-400" />}
                <span>
                  {modalMode === 'source'
                    ? `Source Code: ${endpoint.sourceFile}:${endpoint.lineNumber}`
                    : modalMode === 'openapi'
                    ? `OpenAPI 3.1 Specification Segment`
                    : `Change History: ${endpoint.method} ${endpoint.path}`}
                </span>
              </h3>
              <button
                onClick={() => setModalMode('none')}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalMode === 'source' && (
              <div className="space-y-2">
                <p className="text-xs text-zinc-400">
                  AST extracted Express route controller implementation from workspace:
                </p>
                <CodeBlock
                  code={
                    endpoint.sourceSnippet ||
                    `// ${endpoint.sourceFile}\nimport { Router } from 'express';\nimport { ${endpoint.controller.split('.')[0]} } from '../controllers';\n\nconst router = Router();\n\n${endpoint.method.toLowerCase()}('${endpoint.path.replace('/api', '')}', ${endpoint.controller});`
                  }
                  language="typescript"
                  showLineNumbers={true}
                  maxHeight="320px"
                />
              </div>
            )}

            {modalMode === 'openapi' && (
              <div className="space-y-2">
                <p className="text-xs text-zinc-400">
                  Dynamically synchronized OpenAPI 3.1 YAML fragment:
                </p>
                <CodeBlock code={openapiSnippet} language="yaml" maxHeight="320px" />
              </div>
            )}

            {modalMode === 'history' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-semibold text-emerald-400">Commit a83f9c2</span>
                    <span className="text-zinc-500">2 minutes ago</span>
                  </div>
                  <p className="text-zinc-300 font-medium">
                    feat(orders): add deliveryAddress and customerNote fields to order payload
                  </p>
                  <div className="text-zinc-400 text-[11px]">
                    Author: alex.chen@devtools.io • Verified by APIverse Agent
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2 text-xs opacity-75">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-semibold text-zinc-400">Commit 89f4b01</span>
                    <span className="text-zinc-500">1 day ago</span>
                  </div>
                  <p className="text-zinc-300 font-medium">
                    feat(orders): initial creation of OrderController with validation middleware
                  </p>
                </div>

                <button
                  onClick={() => {
                    setModalMode('none');
                    onNavigateToChanges();
                  }}
                  className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  View in Change Center →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
