import React from 'react';
import {
  Layers,
  FileCheck2,
  GitCompare,
  AlertTriangle,
  Clock,
  Rocket,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Zap,
  ShieldAlert,
  GitBranch,
} from 'lucide-react';
import { Project, ApiChange, AgentExecution } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface DashboardPageProps {
  project: Project;
  changes: ApiChange[];
  agentExecutions: AgentExecution[];
  onNavigate: (page: string) => void;
  onTriggerSimulation: (scenario: 'non_breaking' | 'breaking') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  project,
  changes,
  agentExecutions,
  onNavigate,
  onTriggerSimulation,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome / Repo Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">API Documentation Overview</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Autonomous Sync
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Connected to <span className="font-mono text-zinc-300 font-semibold">{project.name}</span> ({project.framework}) • Branch <span className="font-mono text-zinc-300">{project.branch}</span>
          </p>
        </div>

        {/* Quick simulation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTriggerSimulation('non_breaking')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Code Change</span>
          </button>
          <button
            onClick={() => onNavigate('openapi')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
          >
            Open Swagger UI →
          </button>
        </div>
      </div>

      {/* Top Statistics 4-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total APIs</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">{project.apiCount}</div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <span className="text-blue-400 font-medium">100%</span>
            <span>discovered from AST</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Documented</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{project.documentedCount}</div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">92.8%</span>
            <span>OpenAPI 3.1 compliance</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Changes Detected</span>
            <GitCompare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{project.changesCount}</div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <span>Across last 3 commits</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Breaking Changes</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{project.breakingCount}</div>
          <div className="text-[11px] text-rose-400/90 font-medium flex items-center gap-1">
            <span>Requires review/gate</span>
          </div>
        </div>
      </div>

      {/* Documentation Status & Sync Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status Card */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Documentation Status
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-base font-bold text-zinc-100">Synchronized</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              No documentation drift. OAS spec reflects latest AST code snapshot.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-zinc-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Last Scan</span>
              </span>
              <span className="font-mono text-zinc-300 font-medium">{project.lastScan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-zinc-500" />
                <span>Last Deployment</span>
              </span>
              <span className="text-emerald-400 font-mono font-medium">
                Successful ({project.lastDeployment.version})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
                <span>Commit</span>
              </span>
              <span className="font-mono text-zinc-400">{project.lastCommit.hash}</span>
            </div>
          </div>
        </div>

        {/* Documentation Health & Activity Chart (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                API Coverage & Drift Trends
              </div>
              <div className="text-xs text-zinc-500">Autonomous synchronization coverage over recent build cycles</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Coverage: 93%
            </span>
          </div>

          {/* SVG Visual Graph representing Documentation Status over time */}
          <div className="h-32 w-full pt-2">
            <div className="h-24 flex items-end justify-between gap-2 px-1">
              {[
                { build: 'v1.1', total: 32, sync: 28, changes: 4 },
                { build: 'v1.2', total: 35, sync: 33, changes: 2 },
                { build: 'v1.3', total: 38, sync: 36, changes: 3 },
                { build: 'v1.3.8', total: 40, sync: 38, changes: 5 },
                { build: 'v1.3.9', total: 41, sync: 39, changes: 2 },
                { build: 'v1.4.0 (Now)', total: 42, sync: 39, changes: 3 },
              ].map((item, idx) => (
                <div key={item.build} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-20">
                    <div
                      style={{ height: `${(item.total / 45) * 100}%` }}
                      className="w-3 sm:w-4 bg-zinc-700/80 rounded-t-sm group-hover:bg-zinc-600 transition-all"
                      title={`Total APIs: ${item.total}`}
                    />
                    <div
                      style={{ height: `${(item.sync / 45) * 100}%` }}
                      className="w-3 sm:w-4 bg-emerald-500/80 rounded-t-sm group-hover:bg-emerald-400 transition-all"
                      title={`Documented: ${item.sync}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 truncate max-w-full">
                    {item.build}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-zinc-700" /> Total Discovered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Synchronized in OAS 3.1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Columns: Recent API Changes & Agent Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent API Changes */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Recent API Changes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('changes')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View All Changes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-800/70">
            {changes.slice(0, 3).map((change) => (
              <div
                key={change.id}
                onClick={() => onNavigate('changes')}
                className="p-3.5 hover:bg-zinc-800/40 cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge type="method" value={change.method} size="sm" />
                    <span className="font-mono text-xs font-semibold text-zinc-200">
                      {change.endpoint}
                    </span>
                  </div>
                  <StatusBadge
                    type="change"
                    value={change.breaking ? 'breaking' : change.changeType}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-zinc-400 leading-snug">{change.description}</p>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Commit {change.commit.hash}</span>
                  <span>{change.detectedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Activity Preview */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                Agent Activity Stream
              </h2>
            </div>
            <button
              onClick={() => onNavigate('agents')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Full Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {agentExecutions.slice(0, 4).map((exec) => (
              <div key={exec.id} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-zinc-500 text-[11px] pt-0.5 w-14 shrink-0">
                  {exec.startedAt}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-200">{exec.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-800">
                      {exec.agent}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5 line-clamp-1">{exec.output}</p>
                </div>
                <span className="font-mono text-[10px] text-emerald-400/90 pt-0.5">
                  {exec.durationMs}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
