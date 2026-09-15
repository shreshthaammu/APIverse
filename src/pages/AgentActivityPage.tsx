import React, { useState } from 'react';
import { AgentExecution } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Cpu,
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
  Play,
  RotateCcw,
  Terminal,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  GitBranch,
} from 'lucide-react';

interface AgentActivityPageProps {
  executions: AgentExecution[];
  onTriggerSimulation: (scenario: 'non_breaking' | 'breaking') => void;
}

export const AgentActivityPage: React.FC<AgentActivityPageProps> = ({
  executions,
  onTriggerSimulation,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(executions[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Agent Activity & Pipeline</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Loop Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time execution telemetry from the multi-agent autonomous synchronizer.
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTriggerSimulation('non_breaking')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Change Pipeline</span>
          </button>
          <button
            onClick={() => onTriggerSimulation('breaking')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Breaking Gate</span>
          </button>
        </div>
      </div>

      {/* Agent Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-400 text-xs">Total Pipeline Runs</div>
          <div className="text-2xl font-bold font-mono text-zinc-100">142</div>
          <div className="text-[11px] text-zinc-500">Autonomous triggers</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-400 text-xs">Average Execution Time</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">410 ms</div>
          <div className="text-[11px] text-zinc-500">AST parsing + OAS generation</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-400 text-xs">OAS 3.1 Validation Rate</div>
          <div className="text-2xl font-bold font-mono text-blue-400">100%</div>
          <div className="text-[11px] text-zinc-500">Zero syntax drift</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1">
          <div className="text-zinc-400 text-xs">Auto-Deploy Rate</div>
          <div className="text-2xl font-bold font-mono text-amber-400">96.4%</div>
          <div className="text-[11px] text-zinc-500">3.6% gated on breaking changes</div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Autonomous Agent Execution Timeline
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {executions.length} stages recorded
          </span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {executions.map((exec, idx) => {
            const isExpanded = expandedId === exec.id;

            return (
              <div key={exec.id} className="transition-colors hover:bg-zinc-900/40">
                <div
                  onClick={() => toggleExpand(exec.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button className="text-zinc-500 hover:text-zinc-300">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold shrink-0">
                      {idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-100">{exec.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {exec.agent}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{exec.output}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                    <span className="text-zinc-500 text-[11px] hidden sm:inline">
                      {exec.startedAt}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 text-[11px] font-semibold border border-zinc-700">
                      {exec.durationMs}ms
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 bg-zinc-950/80 border-t border-zinc-800/80 space-y-3">
                    <div className="text-xs text-zinc-300">{exec.output}</div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                        Agent Log Payload
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {exec.details}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
