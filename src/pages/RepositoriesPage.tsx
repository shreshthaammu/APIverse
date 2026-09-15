import React, { useState } from 'react';
import {
  FolderGit2,
  GitBranch,
  RefreshCw,
  Code2,
  FileCode2,
  GitCompare,
  Settings,
  Plus,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Project } from '../types';

interface RepositoriesPageProps {
  project: Project;
  onNavigate: (page: string) => void;
  onScanRepository: () => void;
  isScanning: boolean;
}

export const RepositoriesPage: React.FC<RepositoriesPageProps> = ({
  project,
  onNavigate,
  onScanRepository,
  isScanning,
}) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState('https://github.com/my-org/express-microservice');
  const [branchName, setBranchName] = useState('main');
  const [framework, setFramework] = useState('Express + TypeScript');
  const [connectedSuccess, setConnectedSuccess] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectedSuccess(true);
    setTimeout(() => {
      setConnectedSuccess(false);
      setShowConnectModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Repositories</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage synchronized code repositories, branch bindings, and automated scanning hooks.
          </p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Connect GitHub Repository</span>
        </button>
      </div>

      {/* Main Active Repository Card: Demo API */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-zinc-100">{project.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                  SYNCHRONIZED
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Primary
                </span>
              </div>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 mt-1 font-mono group"
              >
                <span>{project.repositoryUrl}</span>
                <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onScanRepository}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isScanning ? 'Scanning AST...' : 'Scan Repository'}</span>
            </button>
          </div>
        </div>

        {/* Repository Details & Metrics */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-zinc-800 text-xs">
          <div>
            <div className="text-zinc-500 text-[11px] mb-1">Framework</div>
            <div className="font-semibold text-zinc-200">{project.framework}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px] mb-1">Target Branch</div>
            <div className="font-mono text-zinc-200 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
              <span>{project.branch}</span>
            </div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px] mb-1">Discovered APIs</div>
            <div className="font-mono text-zinc-200">{project.apiCount} endpoints</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[11px] mb-1">Last AST Scan</div>
            <div className="font-mono text-zinc-400">{project.lastScan}</div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-4 bg-zinc-950/80 flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('apis')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>View APIs ({project.apiCount})</span>
          </button>

          <button
            onClick={() => onNavigate('openapi')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Generate Documentation</span>
          </button>

          <button
            onClick={() => onNavigate('changes')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-amber-400" />
            <span>View Changes ({project.changesCount})</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Connect Repository Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-100">Connect GitHub Repository</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block">GitHub Repository URL</label>
                <input
                  type="text"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/organization/repo-name"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium block">Branch</label>
                  <input
                    type="text"
                    required
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-zinc-700 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium block">Framework</label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="Express + TypeScript">Express + TypeScript</option>
                    <option value="Fastify + TypeScript">Fastify + TypeScript</option>
                    <option value="NestJS">NestJS</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Webhook & Signature Automation</span>
                </div>
                <p className="text-[11px]">
                  APIverse will configure automated git push webhooks with HMAC-SHA256 signature verification.
                </p>
              </div>

              {connectedSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Repository connected! Running initial AST discovery scan...</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold"
                >
                  Connect & Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
