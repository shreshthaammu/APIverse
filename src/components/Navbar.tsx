import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  Zap,
  AlertTriangle,
  RotateCcw,
  Check,
  ExternalLink,
  GitBranch,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Project, ApiChange } from '../types';

interface NavbarProps {
  project: Project;
  changes: ApiChange[];
  onTriggerSimulation: (scenario: 'non_breaking' | 'breaking') => void;
  onResetDemo: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCommandPalette: () => void;
  onOpenAiCopilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  changes,
  onTriggerSimulation,
  onResetDemo,
  activePage,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
  onOpenAiCopilot,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadAlerts = changes.filter((c) => c.breaking || c.status === 'pending_approval');

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between gap-4">
      {/* Brand & Repository selector */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group transition-transform"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-100 shadow-sm group-hover:border-zinc-500 transition-colors">
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-100 tracking-tight">APIverse</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AGENT ACTIVE
              </span>
            </div>
          </div>
        </button>

        <div className="h-4 w-px bg-zinc-800 hidden md:block" />

        {/* Active Repo pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
          <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-medium text-zinc-200">{project.name}</span>
          <span className="text-zinc-500 font-mono text-[11px]">:main</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" title="Synchronized" />
        </div>
      </div>

      {/* Center Search Input & Command Palette Trigger */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-3 pr-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 flex items-center justify-between transition-colors text-left font-mono"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-400 truncate">Quick Search & Commands...</span>
          </div>
          <kbd className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Action triggers: Simulate Code Change, Breaking Demo, AI Copilot, Reset */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAiCopilot}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
          title="Open AI Schema Copilot"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        <button
          onClick={() => onTriggerSimulation('non_breaking')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
          title="Simulate Express route change with deliveryAddress"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden md:inline">Simulate Code Change</span>
          <span className="md:hidden">Simulate</span>
        </button>

        <button
          onClick={() => onTriggerSimulation('breaking')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all shadow-sm active:scale-95"
          title="Simulate breaking change with quantity type mutation"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Breaking Change Demo</span>
        </button>

        <button
          onClick={onResetDemo}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
          title="Reset demo state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors relative border border-transparent hover:border-zinc-700"
            title="Agent notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-zinc-950" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 font-medium text-zinc-200">
                <span>Agent Notifications</span>
                <span className="text-[10px] font-mono text-zinc-500">{changes.length} events</span>
              </div>
              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {changes.map((chg) => (
                  <div
                    key={chg.id}
                    onClick={() => {
                      onNavigate('changes');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold text-zinc-200">
                        {chg.method} {chg.endpoint}
                      </span>
                      {chg.breaking ? (
                        <span className="text-[10px] font-mono text-rose-400">BREAKING</span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400">MODIFIED</span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                      {chg.description}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Commit {chg.commit.hash} • {chg.detectedAt}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[11px] text-zinc-400">
                <button
                  onClick={() => {
                    onNavigate('agents');
                    setShowNotifications(false);
                  }}
                  className="hover:text-zinc-200"
                >
                  View Agent Timeline →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">
            <span>DV</span>
          </div>
        </div>
      </div>
    </header>
  );
};
