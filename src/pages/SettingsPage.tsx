import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Webhook,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'agent' | 'cicd' | 'notifications' | 'general'>('agent');
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [openApiVersion, setOpenApiVersion] = useState('3.1.0');
  const [webhookUrl, setWebhookUrl] = useState('https://apiverse.dev/api/webhooks/v1/wh_92bf881a7');
  const [webhookSecret, setWebhookSecret] = useState('whsec_89df23a0491bfd491104e76');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Notification toggles
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [discordEnabled, setDiscordEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(webhookSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Project Settings</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure autonomous agent policies, CI/CD webhooks, and team notification channels.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved and applied to active repository pipeline!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
        {[
          { id: 'agent', label: 'Agent Configuration', icon: Cpu },
          { id: 'cicd', label: 'CI/CD & Webhooks', icon: Webhook },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'general', label: 'General', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Panel 1: Agent Configuration */}
      {activeCategory === 'agent' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-5">
            <h3 className="text-sm font-bold text-zinc-100">Autonomous Execution Rules</h3>

            {/* Auto-Deploy toggle */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-zinc-200">
                  Continuous Auto-Deploy
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  Automatically publish OpenAPI 3.1 updates to Swagger CDN when non-breaking changes pass AST validation.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoDeploy(!autoDeploy)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  autoDeploy ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoDeploy ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Require Approval toggle */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                  <span>Require Approval for Breaking Changes</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Recommended
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  Pause automated deployment when the Breaking Change Agent detects removed endpoints or incompatible property types.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRequireApproval(!requireApproval)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  requireApproval ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    requireApproval ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* OpenAPI version selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-200 block">
                Target OpenAPI Specification Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setOpenApiVersion('3.1.0')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    openApiVersion === '3.1.0'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-xs">OpenAPI 3.1.0 (Latest)</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Full JSON Schema 2020-12 alignment with modern union types & webhooks.
                  </div>
                </div>

                <div
                  onClick={() => setOpenApiVersion('3.0.3')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    openApiVersion === '3.0.3'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-xs">OpenAPI 3.0.3 (Legacy Support)</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Backwards compatible with older code generator tools.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel 2: CI/CD & Webhooks */}
      {activeCategory === 'cicd' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100">GitHub / GitLab Webhook Endpoint</h3>
            <p className="text-xs text-zinc-400">
              Paste this webhook URL into your GitHub repository settings under <span className="font-mono text-zinc-300">Webhooks → Add Webhook</span> with event triggers: <span className="font-mono text-zinc-300">Push</span> and <span className="font-mono text-zinc-300">Pull Request</span>.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block font-sans">Payload Delivery URL</label>
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block font-sans">Secret Token (HMAC-SHA256)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value={webhookSecret}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200"
                  />
                  <button
                    onClick={handleCopySecret}
                    className="px-3 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 shrink-0 font-sans"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel 3: Notifications */}
      {activeCategory === 'notifications' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-5">
            <h3 className="text-sm font-bold text-zinc-100">Alert Channels</h3>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-zinc-200">Slack Alerts</div>
                <div className="text-xs text-zinc-400">Post notifications in #api-platform channel on breaking changes.</div>
              </div>
              <button
                type="button"
                onClick={() => setSlackEnabled(!slackEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  slackEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    slackEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-zinc-200">Discord Webhook</div>
                <div className="text-xs text-zinc-400">Deliver schema diff summaries to dev discord.</div>
              </div>
              <button
                type="button"
                onClick={() => setDiscordEnabled(!discordEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  discordEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    discordEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-zinc-200">Email Digest</div>
                <div className="text-xs text-zinc-400">Daily synchronization recap to repository maintainers.</div>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  emailAlerts ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    emailAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel 4: General */}
      {activeCategory === 'general' && (
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-zinc-100">Project Identity</h3>
          <div className="space-y-3">
            <div>
              <label className="text-zinc-400 block mb-1">Project Name</label>
              <input
                type="text"
                defaultValue="Demo API"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Target Production URL</label>
              <input
                type="text"
                defaultValue="https://api.example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
