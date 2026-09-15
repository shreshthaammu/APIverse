import React, { useState } from 'react';
import { ApiEndpoint, HttpMethod } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CodeBlock } from '../components/CodeBlock';
import {
  Server,
  Play,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Sliders,
  Send,
  Sparkles,
  Zap,
  Globe,
  AlertCircle,
  Shield,
  Activity,
  Code2,
} from 'lucide-react';

interface MockServerPageProps {
  endpoints: ApiEndpoint[];
}

export const MockServerPage: React.FC<MockServerPageProps> = ({ endpoints }) => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(
    endpoints[0]?.id || 'ep_orders_create'
  );
  const [selectedStatusCode, setSelectedStatusCode] = useState<number>(200);
  const [latencyMs, setLatencyMs] = useState<number>(120);
  const [chaosFailureRate, setChaosFailureRate] = useState<number>(0);
  const [authHeader, setAuthHeader] = useState<string>('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [requestBodyText, setRequestBodyText] = useState<string>('');
  const [customResponseOverride, setCustomResponseOverride] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: number;
    statusText: string;
    responseTimeMs: number;
    headers: Record<string, string>;
    body: any;
    timestamp: string;
  } | null>(null);

  const endpoint = endpoints.find((e) => e.id === selectedEndpointId) || endpoints[0];

  // Initialize request body when endpoint changes
  React.useEffect(() => {
    if (endpoint) {
      if (endpoint.requestSchema?.example) {
        setRequestBodyText(JSON.stringify(endpoint.requestSchema.example, null, 2));
      } else {
        setRequestBodyText('');
      }

      // Default status code to first available response
      const defaultStatus = endpoint.responses[0]?.statusCode || 200;
      setSelectedStatusCode(defaultStatus);
      setCustomResponseOverride('');
    }
  }, [endpoint]);

  const mockBaseUrl = 'https://mock.apiverse.dev/v1';
  const fullMockUrl = `${mockBaseUrl}${endpoint.path}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullMockUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Generate realistic mock data for selected endpoint & status code
  const getSimulatedResponse = (code: number) => {
    if (customResponseOverride.trim()) {
      try {
        return JSON.parse(customResponseOverride);
      } catch (e) {
        // Fallback
      }
    }

    const matchedResponse = endpoint.responses.find((r) => r.statusCode === code);
    if (matchedResponse?.example) return matchedResponse.example;

    if (code >= 200 && code < 300) {
      if (endpoint.path.includes('/orders')) {
        return {
          success: true,
          orderId: 'ord_mock_' + Math.floor(Math.random() * 899999 + 100000),
          status: 'confirmed',
          totalAmount: 299.98,
          currency: 'USD',
          deliveryAddress: 'Hyderabad, Hitec City 500081',
          customerNote: 'Leave with reception',
          items: [
            { productId: 'prod_123', quantity: 2, unitPrice: 149.99 },
          ],
          estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
          createdAt: new Date().toISOString(),
          _mockServer: 'APIVerse-AST-Synthetic-Generator-v1.4',
        };
      }
      if (endpoint.path.includes('/auth/login')) {
        return {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mockToken12345',
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: {
            id: 'usr_88203',
            name: 'Alex Chen',
            email: 'alex.chen@devtools.io',
            role: 'Lead Architect',
          },
        };
      }
      if (endpoint.path.includes('/products')) {
        return {
          id: 'prod_902',
          name: 'High-Throughput Enterprise Gateway',
          sku: 'GW-ENT-902',
          pricing: { base: 499.0, currency: 'USD' },
          inStock: true,
          inventory: 48,
          lastUpdated: new Date().toISOString(),
        };
      }
      return {
        message: 'Request handled successfully by autonomous mock server',
        endpoint: endpoint.path,
        timestamp: new Date().toISOString(),
      };
    }

    if (code === 400) {
      return {
        error: 'Bad Request',
        message: 'Validation failed: deliveryAddress is required and cannot be blank',
        code: 'ERR_VALIDATION_FAILED',
        timestamp: new Date().toISOString(),
      };
    }

    if (code === 401) {
      return {
        error: 'Unauthorized',
        message: 'Invalid or expired Bearer token provided in Authorization header',
        code: 'ERR_AUTH_INVALID',
      };
    }

    if (code === 404) {
      return {
        error: 'Not Found',
        message: `Resource at path ${endpoint.path} does not exist`,
        code: 'ERR_RESOURCE_NOT_FOUND',
      };
    }

    if (code === 429) {
      return {
        error: 'Too Many Requests',
        message: 'Rate limit threshold reached (100 req/min). Retry after 30 seconds.',
        retryAfter: 30,
      };
    }

    return {
      error: 'Internal Server Error',
      message: 'Unexpected simulation runtime fault in backend microservice',
      traceId: 'trace_' + Math.random().toString(36).substring(2, 9),
    };
  };

  const handleDispatchCall = () => {
    setIsExecuting(true);
    setExecutionResult(null);

    // Calculate actual latency
    const targetLatency = latencyMs + Math.floor(Math.random() * 20 - 10);
    const safeLatency = Math.max(10, targetLatency);

    setTimeout(() => {
      // Check chaos failure
      let statusCodeToUse = selectedStatusCode;
      if (chaosFailureRate > 0 && Math.random() * 100 < chaosFailureRate) {
        statusCodeToUse = 429;
      }

      const bodyData = getSimulatedResponse(statusCodeToUse);

      setExecutionResult({
        status: statusCodeToUse,
        statusText:
          statusCodeToUse === 200
            ? 'OK'
            : statusCodeToUse === 201
            ? 'Created'
            : statusCodeToUse === 400
            ? 'Bad Request'
            : statusCodeToUse === 401
            ? 'Unauthorized'
            : statusCodeToUse === 404
            ? 'Not Found'
            : statusCodeToUse === 429
            ? 'Too Many Requests'
            : 'Internal Server Error',
        responseTimeMs: safeLatency,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-apiverse-mock': 'true',
          'x-apiverse-spec-version': 'OpenAPI 3.1.0',
          'x-response-time': `${safeLatency}ms`,
          'cache-control': 'no-cache, no-store',
          'access-control-allow-origin': '*',
        },
        body: bodyData,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsExecuting(false);
    }, safeLatency);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Mock API Server</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              LIVE SANDBOX
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Zero-configuration mock endpoints generated directly from your OpenAPI 3.1 specifications.
            Test edge cases, simulate network latency, and prototype client apps without running local servers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[200px]">{fullMockUrl}</span>
            <button
              onClick={handleCopyUrl}
              className="p-1 hover:text-zinc-100 transition-colors"
              title="Copy public mock URL"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls, Right Request/Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoint Picker & Simulation Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Endpoint Picker Card */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <label className="text-xs font-semibold text-zinc-200 block">Select Target API Endpoint</label>
            <select
              value={selectedEndpointId}
              onChange={(e) => setSelectedEndpointId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:border-zinc-700 focus:outline-none"
            >
              {endpoints.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  [{ep.method}] {ep.path} — {ep.summary}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
              <span className="text-zinc-400">Method & Auth</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={endpoint.method} size="sm" />
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-zinc-500" />
                  {endpoint.authentication}
                </span>
              </div>
            </div>
          </div>

          {/* Simulation Settings */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Behavior & Latency Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Autonomous</span>
            </div>

            {/* Target Status Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">
                Simulated HTTP Status Code
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[200, 201, 400, 401, 404, 429, 500].map((code) => {
                  const isSelected = selectedStatusCode === code;
                  const isSuccess = code < 300;
                  const isClientErr = code >= 400 && code < 500;
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedStatusCode(code)}
                      className={`py-1.5 px-2 rounded text-xs font-mono font-bold transition-all border ${
                        isSelected
                          ? isSuccess
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : isClientErr
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Artificial Latency Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  Network Latency
                </span>
                <span className="font-mono text-emerald-400 font-bold">{latencyMs} ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={latencyMs}
                onChange={(e) => setLatencyMs(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0ms (Instant)</span>
                <span>350ms (4G/LTE)</span>
                <span>2000ms (Slow 3G)</span>
              </div>
            </div>

            {/* Chaos Error Injection */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Chaos Rate-Limit Flakiness
                </span>
                <span className="font-mono text-amber-400 font-bold">{chaosFailureRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={chaosFailureRate}
                onChange={(e) => setChaosFailureRate(Number(e.target.value))}
                className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500">
                Randomly drops {chaosFailureRate}% of incoming requests with HTTP 429 Too Many Requests.
              </p>
            </div>
          </div>

          {/* Custom Response Override */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Response Payload Override (Optional)
              </label>
              {customResponseOverride && (
                <button
                  onClick={() => setCustomResponseOverride('')}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={customResponseOverride}
              onChange={(e) => setCustomResponseOverride(e.target.value)}
              placeholder="Paste custom JSON to override default schema generation..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-[11px] text-zinc-300 focus:border-zinc-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column: Interactive Dispatcher & Real-Time Response */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dispatch Panel */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 flex-1">
                <span className="font-bold text-emerald-400 mr-2">{endpoint.method}</span>
                <span className="truncate">{endpoint.path}</span>
              </div>

              <button
                onClick={handleDispatchCall}
                disabled={isExecuting}
                className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shrink-0"
              >
                {isExecuting ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Mock Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Body & Headers accordion */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Authorization Header</label>
                <input
                  type="text"
                  value={authHeader}
                  onChange={(e) => setAuthHeader(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 focus:outline-none"
                />
              </div>

              {endpoint.method !== 'GET' && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-zinc-400">
                      Request Payload (JSON)
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">application/json</span>
                  </div>
                  <textarea
                    rows={4}
                    value={requestBodyText}
                    onChange={(e) => setRequestBodyText(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 font-mono text-[11px] text-zinc-200 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Response Console */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Live Response Console
                </h3>
              </div>

              {executionResult && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      executionResult.status < 300
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : executionResult.status < 500
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {executionResult.status} {executionResult.statusText}
                  </span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {executionResult.responseTimeMs}ms
                  </span>
                </div>
              )}
            </div>

            {executionResult ? (
              <div className="space-y-3">
                {/* Headers */}
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] space-y-1 text-zinc-400">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 pb-1 border-b border-zinc-800">
                    Response Headers
                  </div>
                  {Object.entries(executionResult.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-zinc-500">{k}:</span>
                      <span className="text-zinc-300">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Response Body</span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Dispatched at {executionResult.timestamp}
                    </span>
                  </div>
                  <CodeBlock
                    code={JSON.stringify(executionResult.body, null, 2)}
                    language="json"
                  />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl space-y-2">
                <Sparkles className="w-6 h-6 text-zinc-600 mx-auto" />
                <div className="text-xs font-medium text-zinc-300">Mock Server Ready</div>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                  Click <span className="font-mono text-emerald-400">"Send Mock Request"</span> above to test real-time synthetic responses, AST-validated payloads, and latency characteristics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
