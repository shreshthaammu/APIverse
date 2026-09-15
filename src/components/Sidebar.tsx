import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
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
  GitBranch,
  CheckCircle2,
  Home,
} from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenAiCopilot: () => void;
  project: Project;
  changesCount: number;
  breakingCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onOpenAiCopilot,
  project,
  changesCount,
  breakingCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const sections = [
    {
      title: 'Core Platform',
      items: [
        { id: 'landing', label: 'Product Overview', icon: Home, badge: null },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'repositories', label: 'Repositories', icon: FolderGit2, badge: null },
        { id: 'apis', label: 'API Explorer', icon: Code2, badge: project.apiCount },
        {
          id: 'changes',
          label: 'Changes',
          icon: GitCompare,
          badge: changesCount,
          alert: breakingCount > 0,
        },
        { id: 'agents', label: 'Agent Activity', icon: Cpu, badge: 'Live' },
      ],
    },
    {
      title: 'Developer Tools',
      items: [
        { id: 'openapi', label: 'OpenAPI 3.1 Specs', icon: FileCode2, badge: null },
        { id: 'mock-server', label: 'Mock API Server', icon: Server, badge: 'Sandbox' },
        { id: 'sdks', label: 'Client SDK Studio', icon: Terminal, badge: null },
        { id: 'contract-tests', label: 'Contract Testing', icon: ShieldCheck, badge: null },
        { id: 'playpen', label: 'AST Schema Playpen', icon: Code2, badge: 'New' },
        { id: 'changelog', label: 'Changelog Notes', icon: FileText, badge: null },
      ],
    },
    {
      title: 'Operations',
      items: [
        { id: 'deployments', label: 'Deployments', icon: Rocket, badge: null },
        { id: 'settings', label: 'Settings & Webhooks', icon: Settings, badge: null },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1">
          {/* AI Copilot Quick Launcher */}
          <button
            onClick={onOpenAiCopilot}
            className="w-full p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-between transition-all group shadow-sm text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>AI Schema Copilot</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              ASK
            </span>
          </button>

          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                {sec.title}
              </div>

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-3.5 h-3.5 transition-colors ${
                          isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          (item as any).alert
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                            : item.badge === 'Live' || item.badge === 'New' || item.badge === 'Sandbox'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isActive
                            ? 'bg-zinc-700 text-zinc-200'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom System Status */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 space-y-2">
          <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Autonomous Agent</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">SYNCED</span>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 truncate flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-zinc-500" />
              <span>{project.branch}</span>
              <span>@</span>
              <span className="text-zinc-400">{project.lastCommit.hash}</span>
            </div>

            <div className="text-[10px] text-zinc-500">
              Scanned: {project.lastScan}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
