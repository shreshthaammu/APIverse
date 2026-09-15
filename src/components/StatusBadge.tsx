import React from 'react';
import { HttpMethod, SeverityLevel, ChangeType, DeploymentStatus, DocStatus } from '../types';

interface StatusBadgeProps {
  type: 'method' | 'severity' | 'change' | 'deployment' | 'docStatus';
  value: HttpMethod | SeverityLevel | ChangeType | DeploymentStatus | DocStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  value,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-semibold tracking-wider',
    md: 'text-xs px-2 py-0.5 font-medium',
    lg: 'text-xs px-2.5 py-1 font-medium',
  }[size];

  if (type === 'method') {
    const methodColors: Record<string, string> = {
      GET: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      POST: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      PATCH: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    };
    return (
      <span
        className={`inline-flex items-center justify-center font-mono rounded border ${
          methodColors[value as string] || 'bg-zinc-800 text-zinc-300 border-zinc-700'
        } ${sizeClasses} ${className}`}
      >
        {value}
      </span>
    );
  }

  if (type === 'severity') {
    const sevColors: Record<string, string> = {
      low: 'bg-zinc-800/80 text-zinc-300 border-zinc-700',
      medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
    };
    return (
      <span
        className={`inline-flex items-center uppercase tracking-wide rounded-full border ${
          sevColors[value as string] || 'bg-zinc-800 text-zinc-300 border-zinc-700'
        } ${sizeClasses} ${className}`}
      >
        {value}
      </span>
    );
  }

  if (type === 'change') {
    const changeColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
      new: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'NEW' },
      modified: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'MODIFIED' },
      deleted: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'DELETED' },
      breaking: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/40', label: 'BREAKING' },
    };
    const c = changeColors[value as string] || { bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700', label: value };
    return (
      <span className={`inline-flex items-center font-mono rounded border ${c.bg} ${c.text} ${c.border} ${sizeClasses} ${className}`}>
        {c.label}
      </span>
    );
  }

  if (type === 'deployment') {
    const depMap: Record<string, { bg: string; text: string; border: string; label: string }> = {
      success: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'SUCCESS' },
      running: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'RUNNING' },
      failed: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'FAILED' },
      pending_approval: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'PENDING APPROVAL' },
    };
    const d = depMap[value as string] || { bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700', label: value };
    return (
      <span className={`inline-flex items-center rounded-full border font-mono ${d.bg} ${d.text} ${d.border} ${sizeClasses} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
        {d.label}
      </span>
    );
  }

  if (type === 'docStatus') {
    const isSync = value === 'synchronized';
    return (
      <span
        className={`inline-flex items-center rounded-full border ${
          isSync ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        } ${sizeClasses} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isSync ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'} mr-1.5`} />
        {isSync ? 'Synchronized' : 'Sync in progress'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded border bg-zinc-800 text-zinc-300 border-zinc-700 ${sizeClasses} ${className}`}>
      {value}
    </span>
  );
};
