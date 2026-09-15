import React from 'react';
import { ApiChange } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CodeBlock } from '../components/CodeBlock';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Clock,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ChangeDetailsPageProps {
  change: ApiChange;
  onBack: () => void;
  onApprove: (id: string) => void;
}

export const ChangeDetailsPage: React.FC<ChangeDetailsPageProps> = ({
  change,
  onBack,
  onApprove,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Back button & header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Change Center</span>
        </button>

        {change.breaking && change.status === 'pending_approval' && (
          <button
            onClick={() => onApprove(change.id)}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-sm transition-colors"
          >
            Approve Breaking Change & Deploy
          </button>
        )}
      </div>

      {/* Overview Card */}
      <div
        className={`p-6 rounded-xl border space-y-4 ${
          change.breaking
            ? 'border-rose-500/40 bg-zinc-900/80 shadow-md ring-1 ring-rose-500/20'
            : 'border-zinc-800 bg-zinc-900/60'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <StatusBadge type="method" value={change.method} size="lg" />
            <h1 className="text-lg font-mono font-bold text-zinc-100">{change.endpoint}</h1>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge
              type="change"
              value={change.breaking ? 'breaking' : change.changeType}
              size="md"
            />
            <StatusBadge type="severity" value={change.severity} size="md" />
          </div>
        </div>

        <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">{change.description}</p>

        {/* Verification Checks Bar */}
        <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-zinc-500 text-[11px]">Change Type</div>
            <div className="font-semibold text-zinc-200 capitalize">{change.changeType}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px]">Breaking Contract</div>
            <div
              className={`font-semibold ${
                change.breaking ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {change.breaking ? 'Yes (Critical Gate)' : 'No (Compatible)'}
            </div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px]">Documentation</div>
            <div className="font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Updated in OAS 3.1</span>
            </div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px]">Validation Check</div>
            <div className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Passed 100/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Before vs After Comparison */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
          Side-by-Side AST Schema Diff
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Before */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-500" />
                <span>Before (Production Baseline)</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-500">v1.3.9</span>
            </div>
            <CodeBlock
              code={JSON.stringify(change.beforePayload || {}, null, 2)}
              language="json"
              title="Schema: Before"
              showLineNumbers={true}
              maxHeight="280px"
            />
          </div>

          {/* After */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
              <span className="font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>After (Current Git Head)</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">v1.4.0</span>
            </div>
            <CodeBlock
              code={JSON.stringify(change.afterPayload || {}, null, 2)}
              language="json"
              title="Schema: After"
              showLineNumbers={true}
              maxHeight="280px"
            />
          </div>
        </div>
      </div>

      {/* Commit Metadata Card */}
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3 text-xs">
        <div className="font-bold text-zinc-200 uppercase tracking-wider text-xs flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-zinc-400" />
          <span>Originating Git Commit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-1">
          <div>
            <div className="text-zinc-500 text-[11px]">Commit Hash</div>
            <div className="font-semibold text-zinc-200">{change.commit.hash}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px]">Author</div>
            <div className="font-semibold text-zinc-200">{change.commit.author}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px]">Committed At</div>
            <div className="font-semibold text-zinc-400">{change.detectedAt}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-zinc-300 text-xs">
          {change.commit.message}
        </div>
      </div>
    </div>
  );
};
