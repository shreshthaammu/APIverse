import React from 'react';
import {
  Sparkles,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
  Layers,
  Terminal,
  FileCode,
  ShieldCheck,
  Zap,
  Cpu,
  RefreshCw,
  GitBranch,
  ShieldAlert,
  Code2,
} from 'lucide-react';

interface LandingPageProps {
  onGoToDemo: () => void;
  onOpenConnectModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDemo, onOpenConnectModal }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-8 border-b border-zinc-800/80">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Developer Tooling • OpenAPI 3.1 Synchronizer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            API Documentation <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              That Updates Itself.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            An AI-powered agent that understands backend code, detects API changes, keeps OpenAPI
            specifications synchronized, detects breaking changes, and automatically publishes updated documentation.
          </p>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenConnectModal}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2 active:scale-95"
            >
              <GitBranch className="w-4 h-4" />
              <span>Connect Repository</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToDemo}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Try Live Demo</span>
            </button>
          </div>

          {/* Pipeline Visual Flow */}
          <div className="pt-6">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-3">
                Autonomous Synchronisation Pipeline
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                {[
                  { title: 'Backend Code', sub: 'Git push / diff' },
                  { title: 'Detect', sub: 'Webhook / AST scan' },
                  { title: 'Analyze', sub: 'Route & schema extraction' },
                  { title: 'Document', sub: 'OpenAPI 3.1 generation' },
                  { title: 'Validate', sub: 'OAS compliance check' },
                  { title: 'Deploy', sub: 'Swagger CDN publish' },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.title}>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 min-w-[120px] flex-1">
                      <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{step.title}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{step.sub}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0 hidden sm:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Core Architectural Capabilities
          </h2>
          <p className="text-xs text-zinc-400">
            Engineered to eliminate documentation debt through static AST parsing, AI reasoning, and CI/CD gating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Automatic API Discovery</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Detect routes, controllers, middleware, and API structures directly from source code using TypeScript AST analysis without runtime execution.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">AI-Powered Documentation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate accurate OpenAPI 3.1 specifications from backend implementation with semantic parameter summaries and response scenarios.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Breaking Change Detection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Identify potentially incompatible API changes—like removed fields or altered parameter types—before they reach production consumers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Continuous Synchronization</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Keep API documentation aligned with the latest backend version on every git push or pull request commit automatically.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Automated Deployment</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Publish refreshed documentation through CI/CD with CDN edge invalidation and integrated interactive Swagger UI.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Developer Intelligence</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Understand how API changes affect consumers with automated diff comparisons, schema deprecation warnings, and migration guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Banner */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span>Ready to see the autonomous agent in action?</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              2-Minute Walkthrough
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Launch the preconfigured Express + TypeScript Demo API, trigger code mutations, and verify live OpenAPI updates.
          </p>
        </div>
        <button
          onClick={onGoToDemo}
          className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shrink-0 shadow-sm"
        >
          Open Demo Dashboard →
        </button>
      </section>
    </div>
  );
};
