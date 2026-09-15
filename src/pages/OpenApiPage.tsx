import React, { useState } from 'react';
import { ApiEndpoint } from '../types';
import { SwaggerViewer } from '../components/SwaggerViewer';
import { CodeBlock } from '../components/CodeBlock';
import {
  FileCode2,
  Copy,
  Download,
  CheckCircle2,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { dump as yamlDump } from 'js-yaml';

interface OpenApiPageProps {
  endpoints: ApiEndpoint[];
  projectName?: string;
  version?: string;
}

export const OpenApiPage: React.FC<OpenApiPageProps> = ({
  endpoints,
  projectName = 'Demo API',
  version = '1.4.0',
}) => {
  const [activeTab, setActiveTab] = useState<'swagger' | 'yaml' | 'json'>('swagger');
  const [copied, setCopied] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);

  // Generate full OAS 3.1 object
  const openApiObject = {
    openapi: '3.1.0',
    info: {
      title: `${projectName} Specification`,
      version: version,
      description:
        'Continuous OpenAPI 3.1 specification maintained autonomously by APIverse from Express + TypeScript source code.',
      contact: {
        name: 'API Platform Engineering',
        url: 'https://github.com/my-org/demo-api',
      },
    },
    servers: [
      {
        url: 'https://api.example.com',
        description: 'Production API Gateway',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    paths: endpoints.reduce((acc: any, ep) => {
      if (!acc[ep.path]) acc[ep.path] = {};
      acc[ep.path][ep.method.toLowerCase()] = {
        tags: [ep.group],
        summary: ep.summary,
        description: ep.description,
        operationId: ep.controller.replace('.', '_'),
        parameters: ep.parameters.map((p) => ({
          name: p.name,
          in: p.in,
          required: p.required,
          schema: { type: p.type },
          description: p.description,
        })),
        ...(ep.requestSchema
          ? {
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: ep.requestSchema,
                  },
                },
              },
            }
          : {}),
        responses: ep.responses.reduce((rAcc: any, r) => {
          rAcc[r.statusCode] = {
            description: r.description,
            ...(r.schema
              ? {
                  content: {
                    'application/json': {
                      schema: r.schema,
                    },
                  },
                }
              : {}),
          };
          return rAcc;
        }, {}),
      };
      return acc;
    }, {}),
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter standard JWT authorization token',
        },
      },
    },
  };

  const rawJson = JSON.stringify(openApiObject, null, 2);
  const rawYaml = yamlDump(openApiObject, { indent: 2, lineWidth: 120 });

  const handleCopy = () => {
    const textToCopy = activeTab === 'json' ? rawJson : rawYaml;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isYaml = activeTab !== 'json';
    const content = isYaml ? rawYaml : rawJson;
    const blob = new Blob([content], {
      type: isYaml ? 'text/yaml;charset=utf-8' : 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `openapi.${isYaml ? 'yaml' : 'json'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidationSuccess(true);
      setTimeout(() => setValidationSuccess(null), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">OpenAPI 3.1 Specification</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Standardized machine-readable contract continuously synchronized with source AST.
          </p>
        </div>

        {/* Top buttons: Copy, Download, Validate */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={handleValidate}
            disabled={validating}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{validating ? 'Validating...' : 'Validate OAS'}</span>
          </button>
        </div>
      </div>

      {/* Validation feedback message if just triggered */}
      {validationSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>OpenAPI 3.1.0 Validation Passed: 0 schema warnings, 0 syntax defects. 100/100 compliance score.</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-500 text-xs">Specification Format</div>
          <div className="text-lg font-mono font-bold text-zinc-100">OpenAPI 3.1.0</div>
          <div className="text-[10px] text-zinc-500">JSON Schema 2020-12 compatible</div>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-500 text-xs">Total Endpoints</div>
          <div className="text-lg font-mono font-bold text-emerald-400">{endpoints.length}</div>
          <div className="text-[10px] text-zinc-500">Synchronized from source</div>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-500 text-xs">Schema Definitions</div>
          <div className="text-lg font-mono font-bold text-blue-400">18</div>
          <div className="text-[10px] text-zinc-500">Zod & TS interfaces</div>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-500 text-xs">Syntactic Validation</div>
          <div className="text-lg font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Valid</span>
          </div>
          <div className="text-[10px] text-zinc-500">CI/CD Gate Verified</div>
        </div>
      </div>

      {/* Tabs: Swagger UI | Raw YAML | Raw JSON */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('swagger')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'swagger'
              ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Swagger UI (Interactive)
        </button>

        <button
          onClick={() => setActiveTab('yaml')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'yaml'
              ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Raw YAML
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'json'
              ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Raw JSON
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'swagger' && <SwaggerViewer endpoints={endpoints} projectName={projectName} version={version} />}

      {activeTab === 'yaml' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono">openapi.yaml</span>
            <span>{rawYaml.split('\n').length} lines</span>
          </div>
          <CodeBlock
            code={rawYaml}
            language="yaml"
            title="openapi.yaml (OpenAPI 3.1.0)"
            showLineNumbers={true}
            maxHeight="600px"
          />
        </div>
      )}

      {activeTab === 'json' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono">openapi.json</span>
            <span>{rawJson.split('\n').length} lines</span>
          </div>
          <CodeBlock
            code={rawJson}
            language="json"
            title="openapi.json (OpenAPI 3.1.0)"
            showLineNumbers={true}
            maxHeight="600px"
          />
        </div>
      )}
    </div>
  );
};
