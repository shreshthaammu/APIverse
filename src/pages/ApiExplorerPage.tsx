import React, { useState } from 'react';
import { ApiEndpoint } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { SwaggerViewer } from '../components/SwaggerViewer';
import {
  Code2,
  Search,
  Lock,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ApiExplorerPageProps {
  endpoints: ApiEndpoint[];
  onSelectEndpoint: (endpoint: ApiEndpoint) => void;
  searchQuery: string;
}

export const ApiExplorerPage: React.FC<ApiExplorerPageProps> = ({
  endpoints,
  onSelectEndpoint,
  searchQuery: globalSearch,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grouped' | 'interactive'>('grouped');

  const query = (globalSearch || localSearch).toLowerCase();

  const filtered = endpoints.filter((ep) => {
    const matchesSearch =
      ep.path.toLowerCase().includes(query) ||
      ep.summary.toLowerCase().includes(query) ||
      ep.group.toLowerCase().includes(query);
    const matchesMethod = selectedMethod === 'ALL' || ep.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  const groups = Array.from(new Set(filtered.map((ep) => ep.group)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">API Explorer</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Postman & Swagger-inspired contract explorer. Derived continuously from source code AST.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'grouped' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Grouped Catalog
            </button>
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'interactive' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Swagger Interactive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                selectedMethod === m
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search paths or summary..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
          />
        </div>
      </div>

      {/* View Mode 1: Grouped Catalog */}
      {viewMode === 'grouped' ? (
        <div className="space-y-6">
          {groups.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs rounded-xl border border-zinc-800 bg-zinc-900/30">
              No matching endpoints found for this filter.
            </div>
          ) : (
            groups.map((group) => {
              const groupEndpoints = filtered.filter((ep) => ep.group === group);
              return (
                <div key={group} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{group}</span>
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {groupEndpoints.length} endpoint{groupEndpoints.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="divide-y divide-zinc-800/70">
                    {groupEndpoints.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => onSelectEndpoint(ep)}
                        className="p-3.5 hover:bg-zinc-800/40 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <StatusBadge type="method" value={ep.method} size="md" />
                          <span className="font-mono text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                            {ep.path}
                          </span>
                          <span className="text-xs text-zinc-400 truncate hidden md:inline">
                            — {ep.summary}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs shrink-0">
                          {ep.authentication !== 'None' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/80">
                              <Lock className="w-3 h-3 text-zinc-400" />
                              <span className="hidden sm:inline">{ep.authentication}</span>
                            </span>
                          )}

                          {ep.status === 'modified' && (
                            <StatusBadge type="change" value="modified" size="sm" />
                          )}
                          {ep.status === 'breaking' && (
                            <StatusBadge type="change" value="breaking" size="sm" />
                          )}

                          <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors text-[11px] flex items-center gap-1">
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* View Mode 2: Interactive Swagger UI */
        <SwaggerViewer endpoints={filtered} />
      )}
    </div>
  );
};
