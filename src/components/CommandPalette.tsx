import React, { useState, useEffect } from 'react';
import { ApiEndpoint } from '../types';
import {
  Search,
  LayoutDashboard,
  Code2,
  GitCompare,
  Cpu,
  FileCode2,
  Server,
  Terminal,
  ShieldCheck,
  FileText,
  Rocket,
  Settings,
  Sparkles,
  Zap,
  AlertTriangle,
  X,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onSelectEndpoint: (ep: ApiEndpoint) => void;
  onTriggerSimulation: (scenario: 'non_breaking' | 'breaking') => void;
  onOpenAiCopilot: () => void;
  endpoints: ApiEndpoint[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectEndpoint,
  onTriggerSimulation,
  onOpenAiCopilot,
  endpoints,
}) => {
  const [query, setQuery] = useState('');

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pages = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, category: 'Navigation' },
    { id: 'apis', label: 'API Explorer (42 Endpoints)', icon: Code2, category: 'Navigation' },
    { id: 'changes', label: 'Change Center & AST Diffs', icon: GitCompare, category: 'Navigation' },
    { id: 'agents', label: 'Multi-Agent Activity Timeline', icon: Cpu, category: 'Navigation' },
    { id: 'openapi', label: 'OpenAPI 3.1 Swagger Center', icon: FileCode2, category: 'Developer Tools' },
    { id: 'mock-server', label: 'Autonomous Mock Server & Sandbox', icon: Server, category: 'Developer Tools' },
    { id: 'sdks', label: 'Client SDK Studio (TypeScript, Python, Go)', icon: Terminal, category: 'Developer Tools' },
    { id: 'contract-tests', label: 'API Contract Drift Testing', icon: ShieldCheck, category: 'Developer Tools' },
    { id: 'playpen', label: 'AST Schema Playpen & Route Extractor', icon: Code2, category: 'Developer Tools' },
    { id: 'changelog', label: 'Changelog & Release Notes', icon: FileText, category: 'Developer Tools' },
    { id: 'deployments', label: 'Deployments & Edge Releases', icon: Rocket, category: 'Operations' },
    { id: 'settings', label: 'Repository Webhooks & Agent Policies', icon: Settings, category: 'Operations' },
  ];

  const actions = [
    {
      id: 'act_sim_clean',
      label: 'Simulate Code Change (Add deliveryAddress to /api/orders)',
      icon: Zap,
      run: () => {
        onTriggerSimulation('non_breaking');
        onClose();
      },
    },
    {
      id: 'act_sim_break',
      label: 'Simulate Breaking Change (quantity type mutation gate)',
      icon: AlertTriangle,
      run: () => {
        onTriggerSimulation('breaking');
        onClose();
      },
    },
    {
      id: 'act_copilot',
      label: 'Open AI Schema & Documentation Copilot',
      icon: Sparkles,
      run: () => {
        onOpenAiCopilot();
        onClose();
      },
    },
  ];

  const filteredPages = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEndpoints = endpoints
    .filter(
      (e) =>
        e.path.toLowerCase().includes(query.toLowerCase()) ||
        e.summary.toLowerCase().includes(query.toLowerCase()) ||
        e.method.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[75vh]">
        {/* Search Input */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Type a command, route, or page... (e.g. mock, orders, sdk)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none font-sans"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-3 text-xs">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Autonomous Actions
              </div>
              {filteredActions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={act.run}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-200 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium">{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation Pages */}
          {filteredPages.length > 0 && (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Platform Pages
              </div>
              {filteredPages.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigate(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-200 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400" />
                      <span>{p.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{p.category}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Endpoints */}
          {filteredEndpoints.length > 0 && (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                API Endpoints
              </div>
              {filteredEndpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    onSelectEndpoint(ep);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-emerald-400">{ep.method}</span>
                    <span className="text-zinc-300">{ep.path}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                    {ep.summary}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
