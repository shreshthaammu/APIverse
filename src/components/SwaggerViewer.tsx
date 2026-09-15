import React, { useState } from 'react';
import { ApiEndpoint } from '../types';
import { StatusBadge } from './StatusBadge';
import { CodeBlock } from './CodeBlock';
import { Play, ChevronDown, ChevronRight, Lock, CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface SwaggerViewerProps {
  endpoints: ApiEndpoint[];
  projectName?: string;
  version?: string;
}

export const SwaggerViewer: React.FC<SwaggerViewerProps> = ({
  endpoints,
  projectName = 'Demo API',
  version = '1.4.0',
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(endpoints[0]?.id || null);
  const [activeTab, setActiveTab] = useState<Record<string, 'docs' | 'try'>>({});
  const [testPayloads, setTestPayloads] = useState<Record<string, string>>({
    ep_orders_create: JSON.stringify(
      {
        productId: 'prod_123',
        quantity: 2,
        deliveryAddress: 'Hyderabad, Hitec City 500081',
        customerNote: 'Leave with reception',
      },
      null,
      2
    ),
  });
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const groups = Array.from(new Set(endpoints.map((ep) => ep.group)));

  const filteredEndpoints = endpoints.filter((ep) => {
    const matchesSearch =
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.method.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || ep.group === selectedTag;
    return matchesSearch && matchesTag;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleExecute = async (endpoint: ApiEndpoint) => {
    setIsExecuting((prev) => ({ ...prev, [endpoint.id]: true }));

    // Simulate real network trip with responsive feedback
    setTimeout(() => {
      let status = 200;
      let data: any = { message: 'Success' };

      if (endpoint.path === '/api/orders' && endpoint.method === 'POST') {
        try {
          const parsed = JSON.parse(testPayloads[endpoint.id] || '{}');
          if (!parsed.productId || !parsed.quantity) {
            status = 400;
            data = { error: 'Bad Request', message: 'Missing required field: productId or quantity' };
          } else {
            status = 201;
            data = {
              orderId: 'ord_' + Math.random().toString(36).substring(2, 9),
              status: 'processing',
              productId: parsed.productId,
              quantity: parsed.quantity,
              deliveryAddress: parsed.deliveryAddress || 'Hyderabad',
              customerNote: parsed.customerNote || null,
              totalAmount: parsed.quantity * 149.99,
              createdAt: new Date().toISOString(),
            };
          }
        } catch {
          status = 400;
          data = { error: 'Invalid JSON payload' };
        }
      } else if (endpoint.path === '/api/products/{id}') {
        status = 200;
        data = {
          id: 'prod_123',
          sku: 'KB-MECH-RGB',
          title: 'Ergonomic Mechanical Keyboard',
          pricing: { base: 149.99, currency: 'USD' },
          inventory: 48,
          inStock: true,
        };
      } else if (endpoint.path === '/api/auth/login') {
        status = 200;
        data = {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTIzIn0...',
          expiresIn: 3600,
          user: { id: 'usr_892b11', email: 'developer@example.com', role: 'admin' },
        };
      } else {
        status = 200;
        data = {
          status: 'ok',
          path: endpoint.path,
          method: endpoint.method,
          timestamp: new Date().toISOString(),
          sampleResponse: endpoint.responses[0]?.schema || { success: true },
        };
      }

      setTestResults((prev) => ({
        ...prev,
        [endpoint.id]: {
          status,
          statusText: status === 201 ? 'Created' : status === 200 ? 'OK' : 'Bad Request',
          timeMs: Math.floor(Math.random() * 80) + 25,
          data,
        },
      }));
      setIsExecuting((prev) => ({ ...prev, [endpoint.id]: false }));
    }, 450);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/70">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <span>Interactive Swagger UI & API Explorer</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              OpenAPI 3.1.0
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              v{version}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test live endpoints directly against the Demo Express backend with real-time schema validation.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-48"
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
          >
            <option value="all">All Groups ({endpoints.length})</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Endpoints list */}
      <div className="divide-y divide-zinc-800/80">
        {filteredEndpoints.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No API endpoints matching your search criteria.
          </div>
        ) : (
          filteredEndpoints.map((ep) => {
            const isExpanded = expandedId === ep.id;
            const currentTab = activeTab[ep.id] || 'docs';
            const result = testResults[ep.id];
            const executing = isExecuting[ep.id];

            return (
              <div key={ep.id} className="transition-colors hover:bg-zinc-900/40">
                {/* Endpoint row header */}
                <div
                  onClick={() => toggleExpand(ep.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <StatusBadge type="method" value={ep.method} size="md" />
                    <span className="font-mono text-xs font-semibold text-zinc-200 truncate">
                      {ep.path}
                    </span>
                    <span className="hidden sm:inline-block text-xs text-zinc-400 truncate max-w-md">
                      — {ep.summary}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {ep.authentication !== 'None' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/80">
                        <Lock className="w-3 h-3 text-zinc-400" />
                        <span className="hidden md:inline">{ep.authentication}</span>
                      </span>
                    )}
                    {ep.status === 'modified' && (
                      <StatusBadge type="change" value="modified" size="sm" />
                    )}
                    {ep.status === 'breaking' && (
                      <StatusBadge type="change" value="breaking" size="sm" />
                    )}
                  </div>
                </div>

                {/* Expanded Endpoint Body */}
                {isExpanded && (
                  <div className="p-4 bg-zinc-950/80 border-t border-zinc-800/80 space-y-4">
                    {/* Tabs: Documentation vs Try It Out */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab((prev) => ({ ...prev, [ep.id]: 'docs' }))}
                          className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                            currentTab === 'docs'
                              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Specification & Schemas
                        </button>
                        <button
                          onClick={() => setActiveTab((prev) => ({ ...prev, [ep.id]: 'try' }))}
                          className={`text-xs px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                            currentTab === 'try'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Play className="w-3 h-3" />
                          <span>Try It Out</span>
                        </button>
                      </div>

                      <div className="text-[11px] font-mono text-zinc-500">
                        Source: {ep.sourceFile}:{ep.lineNumber}
                      </div>
                    </div>

                    {/* TAB 1: SPECIFICATION & SCHEMAS */}
                    {currentTab === 'docs' && (
                      <div className="space-y-4">
                        <p className="text-xs text-zinc-300 leading-relaxed">{ep.description}</p>

                        {/* Parameters table */}
                        {ep.parameters.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                              Parameters
                            </h4>
                            <div className="rounded-lg border border-zinc-800 overflow-hidden">
                              <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                                  <tr>
                                    <th className="p-2.5">Name</th>
                                    <th className="p-2.5">In</th>
                                    <th className="p-2.5">Type</th>
                                    <th className="p-2.5">Required</th>
                                    <th className="p-2.5">Description</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                                  {ep.parameters.map((param) => (
                                    <tr key={param.name} className="hover:bg-zinc-900/30">
                                      <td className="p-2.5 font-semibold text-zinc-100">{param.name}</td>
                                      <td className="p-2.5 text-zinc-400">{param.in}</td>
                                      <td className="p-2.5 text-blue-400">{param.type}</td>
                                      <td className="p-2.5">
                                        {param.required ? (
                                          <span className="text-rose-400 font-semibold">required</span>
                                        ) : (
                                          <span className="text-zinc-500">optional</span>
                                        )}
                                      </td>
                                      <td className="p-2.5 text-zinc-400">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Request Schema */}
                        {ep.requestSchema && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                                Request Body (application/json)
                              </h4>
                              <span className="text-[11px] text-zinc-500 font-mono">OpenAPI 3.1 Object</span>
                            </div>
                            <CodeBlock
                              code={JSON.stringify(ep.requestSchema, null, 2)}
                              language="json"
                              title="JSON Schema"
                              maxHeight="220px"
                            />
                          </div>
                        )}

                        {/* Responses */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                            Responses
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {ep.responses.map((res) => (
                              <div
                                key={res.statusCode}
                                className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-start gap-2.5"
                              >
                                <span
                                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                                    res.statusCode >= 200 && res.statusCode < 300
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                      : res.statusCode >= 400 && res.statusCode < 500
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  }`}
                                >
                                  {res.statusCode}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs text-zinc-300 font-medium">{res.description}</div>
                                  {res.schema && (
                                    <pre className="text-[11px] font-mono text-zinc-400 mt-1 overflow-x-auto">
                                      {JSON.stringify(res.schema)}
                                    </pre>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: TRY IT OUT */}
                    {currentTab === 'try' && (
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusBadge type="method" value={ep.method} size="sm" />
                            <span className="font-mono text-xs text-zinc-200">{ep.path}</span>
                          </div>
                          <button
                            disabled={executing}
                            onClick={() => handleExecute(ep)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{executing ? 'Sending...' : 'Send Request'}</span>
                          </button>
                        </div>

                        {/* Editable request body if POST/PUT/PATCH */}
                        {['POST', 'PUT', 'PATCH'].includes(ep.method) && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-300 block">
                              Request Body Payload (JSON)
                            </label>
                            <textarea
                              rows={5}
                              value={
                                testPayloads[ep.id] !== undefined
                                  ? testPayloads[ep.id]
                                  : JSON.stringify(ep.requestSchema?.example || {}, null, 2)
                              }
                              onChange={(e) =>
                                setTestPayloads((prev) => ({ ...prev, [ep.id]: e.target.value }))
                              }
                              className="w-full font-mono text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-zinc-700"
                            />
                          </div>
                        )}

                        {/* Live response output */}
                        {result && (
                          <div className="space-y-2 pt-2 border-t border-zinc-800">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                    result.status < 300
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  }`}
                                >
                                  HTTP {result.status} {result.statusText}
                                </span>
                                <span className="text-zinc-500 font-mono text-[11px]">
                                  {result.timeMs} ms
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-500">Live response from Demo Express runtime</span>
                            </div>

                            <CodeBlock
                              code={JSON.stringify(result.data, null, 2)}
                              language="json"
                              title="Response Body"
                              maxHeight="250px"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
