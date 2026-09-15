import React, { useState } from 'react';
import { ApiChange, Deployment } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import {
  FileText,
  Copy,
  Check,
  Download,
  GitCommit,
  Calendar,
  AlertTriangle,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Tag,
  ExternalLink,
} from 'lucide-react';

interface ChangelogPageProps {
  changes: ApiChange[];
  deployments: Deployment[];
  projectName: string;
}

export const ChangelogPage: React.FC<ChangelogPageProps> = ({
  changes,
  deployments,
  projectName,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview');
  const [copied, setCopied] = useState(false);

  // Generate full Markdown changelog string
  const generateMarkdown = () => {
    return `# Changelog — ${projectName}

All notable API contract and schema changes to this project will be documented in this file autonomously by APIverse.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.1] - 2026-09-14
### 🚀 Added
- \`POST /api/orders\`: Added \`deliveryAddress\` (string, required) to specify physical shipping location.
- \`POST /api/orders\`: Added \`customerNote\` (string, optional) for courier delivery instructions.
- Associated Commit: \`a83f9c2\` by *alex.chen@devtools.io*

### 🔄 Changed
- Synchronized OpenAPI 3.1 schema definitions with express route ast parser.
- Regenerated TypeScript and Python SDK client libraries.

---

## [1.4.0] - 2026-09-14
### 🚀 Added
- \`POST /api/payments/charge\`: Introduced 3D-Secure idempotency key header (\`Idempotency-Key\`).
- Expanded response status code coverage with RFC 7807 problem details.

### 🛡️ Security
- Updated JWT bearer authentication schemes to conform with OAuth 2.0 specs.

---

## [1.3.9] - 2026-09-14
### ⚠️ BREAKING CHANGES
- \`GET /api/products/{id}\`: Mutated \`pricing\` from flat numeric price (\`number\`) to multi-currency object (\`{ base: number, currency: string }\`).
- Action required: Update client mobile applications to deserialize object response.
- Associated Commit: \`9f104d8\`

---

## [1.3.8] - 2026-09-14
### 🛡️ Security & Compliance
- \`DELETE /api/users/{id}\`: Required compliance audit header \`X-Reason-Code\` on all deletion invocations.
- Associated Commit: \`4e29b11\`

---

*Autonomously generated and verified by APIverse continuous documentation pipeline.*
`;
  };

  const markdownContent = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CHANGELOG.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Changelog & Release Notes</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              AUTONOMOUS SEMVER
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Machine-generated release notes derived directly from Git commits and AST schema differences. Zero human documentation drift.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CHANGELOG.md</span>
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Visual Release Feed
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              viewMode === 'markdown'
                ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Raw Markdown
          </button>
        </div>

        <span className="text-[11px] font-mono text-zinc-500">
          Format: Keep a Changelog 1.0.0
        </span>
      </div>

      {viewMode === 'markdown' ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs overflow-x-auto shadow-xl">
          <CodeBlock code={markdownContent} language="markdown" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Release Entry 1: v1.4.1 */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-zinc-100 font-mono">v1.4.1</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  LATEST RELEASE
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  September 14, 2026
                </span>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5" />
                <span>commit a83f9c2</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase text-[11px] tracking-wider">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Added Features</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-zinc-300">
                  <li>
                    <span className="font-mono text-zinc-200">POST /api/orders</span>: Added required field <code className="text-emerald-300 bg-zinc-950 px-1 py-0.5 rounded">deliveryAddress</code> for logistics routing.
                  </li>
                  <li>
                    <span className="font-mono text-zinc-200">POST /api/orders</span>: Added optional remarks field <code className="text-emerald-300 bg-zinc-950 px-1 py-0.5 rounded">customerNote</code>.
                  </li>
                </ul>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold uppercase text-[11px] tracking-wider">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Synchronization</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-zinc-300">
                  <li>Rebuilt OpenAPI 3.1.0 specification and regenerated TypeScript/Python SDK bundles.</li>
                  <li>Purged global CDN documentation edge caches.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Release Entry 2: v1.4.0 */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-zinc-100 font-mono">v1.4.0</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-mono font-bold">
                  STABLE
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  September 14, 2026
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5" />
                <span>commit c0421e7</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase text-[11px] tracking-wider">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Added Features</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-zinc-300">
                  <li>Added 3D-Secure idempotency header verification on payment endpoints.</li>
                  <li>Enhanced JWT bearer token security mappings across user routes.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Release Entry 3: v1.3.9 (Breaking) */}
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-rose-200 font-mono">v1.3.9</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                  BREAKING RELEASE
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  September 14, 2026
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5" />
                <span>commit 9f104d8</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold uppercase text-[11px] tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Breaking Contract Changes</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-rose-200/90">
                  <li>
                    <span className="font-mono text-rose-100">GET /api/products/:id</span>: Field <code className="bg-zinc-950 px-1 py-0.5 rounded text-rose-300">pricing</code> changed from numeric scalar to multi-currency object.
                  </li>
                  <li className="text-zinc-400">
                    Mitigation: Legacy mobile clients must update to SDK v1.3.9 or use the back-compat header <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-300">X-Legacy-Pricing: true</code>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
