import React, { useState } from 'react';
import { ApiChange } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  GitCompare,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  GitCommit,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

interface ChangesPageProps {
  changes: ApiChange[];
  onSelectChange: (change: ApiChange) => void;
  onApproveBreakingChange: (changeId: string) => void;
}

export const ChangesPage: React.FC<ChangesPageProps> = ({
  changes,
  onSelectChange,
  onApproveBreakingChange,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'modified' | 'deleted' | 'breaking'>('all');
  const [search, setSearch] = useState('');

  const filtered = changes.filter((c) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'breaking'
        ? c.breaking
        : c.changeType === activeFilter;
    const matchesSearch =
      c.endpoint.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.commit.hash.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const breakingCount = changes.filter((c) => c.breaking).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">API Change Center</h1>
            {breakingCount > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{breakingCount} Breaking Change Gate</span>
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Deterministic AST schema diffs, semantic breaking change classification, and consumer safety guards.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search changes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3 text-xs">
        {[
          { id: 'all', label: 'All Changes', count: changes.length },
          { id: 'modified', label: 'Modified', count: changes.filter((c) => c.changeType === 'modified').length },
          { id: 'new', label: 'New Endpoints', count: changes.filter((c) => c.changeType === 'new').length },
          { id: 'deleted', label: 'Deleted', count: changes.filter((c) => c.changeType === 'deleted').length },
          { id: 'breaking', label: 'Breaking', count: breakingCount, alert: breakingCount > 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition-colors ${
              activeFilter === tab.id
                ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                tab.alert
                  ? 'bg-rose-500/20 text-rose-300 font-bold'
                  : activeFilter === tab.id
                  ? 'bg-zinc-700 text-zinc-200'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Changes list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs rounded-xl border border-zinc-800 bg-zinc-900/40">
            No changes found matching the selected filter.
          </div>
        ) : (
          filtered.map((chg) => (
            <div
              key={chg.id}
              className={`p-5 rounded-xl border transition-all ${
                chg.breaking
                  ? 'border-rose-500/40 bg-zinc-900/80 shadow-md ring-1 ring-rose-500/20'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              {/* Card top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <StatusBadge
                    type="change"
                    value={chg.breaking ? 'breaking' : chg.changeType}
                    size="md"
                  />
                  <StatusBadge type="method" value={chg.method} size="md" />
                  <span className="font-mono text-sm font-bold text-zinc-100">{chg.endpoint}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-mono">Severity:</span>
                  <StatusBadge type="severity" value={chg.severity} size="sm" />
                </div>
              </div>

              {/* Description */}
              <div className="py-3 text-xs text-zinc-300 leading-relaxed">
                <p className="font-medium text-zinc-200">{chg.description}</p>
              </div>

              {/* Visual Diff Indicators: Green = added, Red = removed, Yellow = modified */}
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-2 font-mono text-xs">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  Detected Schema Mutations
                </div>
                {chg.diffFields.map((field, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {field.changeType === 'added' && (
                      <span className="text-emerald-400 font-bold select-none">+</span>
                    )}
                    {field.changeType === 'removed' && (
                      <span className="text-rose-400 font-bold select-none">-</span>
                    )}
                    {(field.changeType === 'type_changed' || field.changeType === 'required_changed') && (
                      <span className="text-amber-400 font-bold select-none">~</span>
                    )}

                    <div className="flex-1 min-w-0">
                      <span
                        className={`font-semibold ${
                          field.changeType === 'added'
                            ? 'text-emerald-300'
                            : field.changeType === 'removed'
                            ? 'text-rose-300 line-through'
                            : 'text-amber-300'
                        }`}
                      >
                        {field.field}
                      </span>
                      {field.oldValue && (
                        <span className="text-zinc-500 text-[11px] ml-2">
                          (was: {field.oldValue})
                        </span>
                      )}
                      {field.newValue && (
                        <span className="text-zinc-300 text-[11px] ml-2">
                          → {field.newValue}
                        </span>
                      )}
                      <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
                        {field.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer status & Actions */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Validated</span>
                  </span>
                  {chg.status === 'deployed' ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Published to v1.4.0</span>
                    </span>
                  ) : chg.status === 'pending_approval' ? (
                    <span className="flex items-center gap-1 text-rose-400 font-semibold animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Deployment Pending Approval</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending sync</span>
                    </span>
                  )}
                  <span className="font-mono text-zinc-500 flex items-center gap-1">
                    <GitCommit className="w-3 h-3 text-zinc-500" />
                    <span>{chg.commit.hash}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {chg.breaking && chg.status === 'pending_approval' && (
                    <button
                      onClick={() => onApproveBreakingChange(chg.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
                    >
                      Approve & Publish
                    </button>
                  )}
                  <button
                    onClick={() => onSelectChange(chg)}
                    className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center gap-1.5 transition-colors border border-zinc-700"
                  >
                    <span>Inspect Before/After Diff</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
