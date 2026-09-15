import React, { useState } from 'react';
import { Deployment } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Rocket,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Clock,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface DeploymentsPageProps {
  deployments: Deployment[];
  onRollback: (version: string) => void;
  onOpenLiveDocs: () => void;
}

export const DeploymentsPage: React.FC<DeploymentsPageProps> = ({
  deployments,
  onRollback,
  onOpenLiveDocs,
}) => {
  const [rollbackSuccess, setRollbackSuccess] = useState<string | null>(null);

  const handleRollbackClick = (version: string) => {
    onRollback(version);
    setRollbackSuccess(version);
    setTimeout(() => setRollbackSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Deployments & Versions</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Documentation release history with edge CDN distribution and instant rollback capabilities.
          </p>
        </div>

        <button
          onClick={onOpenLiveDocs}
          className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Live Swagger UI</span>
        </button>
      </div>

      {rollbackSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Rollback initiated: Reverted active documentation endpoint to {rollbackSuccess}.</span>
        </div>
      )}

      {/* Deployments Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Deployment Release History
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {deployments.length} releases published
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
              <tr>
                <th className="p-3.5">Version</th>
                <th className="p-3.5">Commit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Endpoints</th>
                <th className="p-3.5">Trigger</th>
                <th className="p-3.5">Deployed At</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-300 font-sans">
              {deployments.map((dep, idx) => (
                <tr key={dep.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-zinc-100 flex items-center gap-2">
                    <span>{dep.version}</span>
                    {idx === 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{dep.commitHash}</span>
                    </span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge type="deployment" value={dep.status} size="sm" />
                  </td>
                  <td className="p-3.5 font-mono text-zinc-300">
                    {dep.endpointCount} APIs
                  </td>
                  <td className="p-3.5 text-zinc-400 text-xs font-sans">
                    {dep.triggeredBy}
                  </td>
                  <td className="p-3.5 font-mono text-zinc-400 text-xs">
                    {dep.deployedAt}
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={onOpenLiveDocs}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                      >
                        Preview
                      </button>
                      {idx !== 0 && (
                        <button
                          onClick={() => handleRollbackClick(dep.version)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-medium flex items-center gap-1 transition-colors"
                          title={`Rollback to ${dep.version}`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Rollback</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
