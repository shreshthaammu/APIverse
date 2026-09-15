import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight, X, Sparkles, Terminal, FileCode, ShieldAlert } from 'lucide-react';

interface SimulationStep {
  id: string;
  name: string;
  agent: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'breaking_alert';
  detail: string;
}

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: 'non_breaking' | 'breaking';
  onComplete: (scenario: 'non_breaking' | 'breaking') => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  scenario,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'diff'>('timeline');

  const stepsConfig: SimulationStep[] =
    scenario === 'non_breaking'
      ? [
          {
            id: 'step_detect',
            name: 'Change Detected',
            agent: 'Git Hook Watcher',
            description: 'Detected commit a83f9c2 modifying src/routes/orders.routes.ts',
            status: 'pending',
            detail: 'Git diff shows +14 lines in OrderController and order.schema.ts',
          },
          {
            id: 'step_analyze_code',
            name: 'Analyzing Code & AST',
            agent: 'Repository Scout',
            description: 'Traversing AST tree for Express router definitions',
            status: 'pending',
            detail: 'Identified TypeScript AST call expression router.post("/orders")',
          },
          {
            id: 'step_discover_api',
            name: 'Discovering API',
            agent: 'API Discovery Agent',
            description: 'Resolved full endpoint mounting to POST /api/orders',
            status: 'pending',
            detail: 'Extracted middleware [requireAuth, validate(createOrderSchema)]',
          },
          {
            id: 'step_analyze_schema',
            name: 'Analyzing Schema',
            agent: 'Schema Analysis Agent',
            description: 'Extracted Zod request body definition',
            status: 'pending',
            detail: 'Detected new required property: "deliveryAddress" (string) & "customerNote" (string)',
          },
          {
            id: 'step_gen_openapi',
            name: 'Generating OpenAPI 3.1',
            agent: 'Documentation Agent',
            description: 'Synthesized OpenAPI 3.1 path item with schemas and examples',
            status: 'pending',
            detail: 'Updated application/json requestBody and 201 response schema',
          },
          {
            id: 'step_validate',
            name: 'Validating Specification',
            agent: 'Review & Validator Agent',
            description: 'Executing OAS 3.1.0 JSON schema validation checks',
            status: 'pending',
            detail: 'Validation passed: 0 syntax errors, 100/100 compliance score',
          },
          {
            id: 'step_breaking',
            name: 'Checking Breaking Changes',
            agent: 'Breaking Change Agent',
            description: 'Comparing semantic diff against previous production baseline',
            status: 'pending',
            detail: 'Result: NON-BREAKING (Severity: LOW). New field added safely',
          },
          {
            id: 'step_deploy',
            name: 'Deploying Documentation',
            agent: 'Deployment Agent',
            description: 'Publishing updated Swagger UI and invalidating CDN cache',
            status: 'pending',
            detail: 'Deployment #1042 SUCCESSFUL! Live at /api/openapi/demo',
          },
        ]
      : [
          {
            id: 'step_detect',
            name: 'Change Detected',
            agent: 'Git Hook Watcher',
            description: 'Detected commit 9f104d8 modifying src/routes/orders.routes.ts',
            status: 'pending',
            detail: 'Git diff: type change on quantity parameter and response structure',
          },
          {
            id: 'step_analyze_code',
            name: 'Analyzing Code & AST',
            agent: 'Repository Scout',
            description: 'Parsing TypeScript types and Controller signatures',
            status: 'pending',
            detail: 'Found modified interface OrderPayload { quantity: string; }',
          },
          {
            id: 'step_discover_api',
            name: 'Discovering API',
            agent: 'API Discovery Agent',
            description: 'Inspected affected route POST /api/orders',
            status: 'pending',
            detail: 'Controller: OrderController.create',
          },
          {
            id: 'step_analyze_schema',
            name: 'Analyzing Schema',
            agent: 'Schema Analysis Agent',
            description: 'Deep type diff on payload attributes',
            status: 'pending',
            detail: 'Critical alteration: quantity changed from number -> string',
          },
          {
            id: 'step_gen_openapi',
            name: 'Generating Candidate OpenAPI',
            agent: 'Documentation Agent',
            description: 'Drafted OpenAPI specification for candidate branch',
            status: 'pending',
            detail: 'Draft version: v1.5.0-rc1',
          },
          {
            id: 'step_validate',
            name: 'Validating Specification',
            agent: 'Review & Validator Agent',
            description: 'Syntactical verification against OpenAPI 3.1',
            status: 'pending',
            detail: 'Valid OAS 3.1 document structure',
          },
          {
            id: 'step_breaking',
            name: 'Checking Breaking Changes',
            agent: 'Breaking Change Agent',
            description: 'Comparing type invariants and consumer contract',
            status: 'breaking_alert',
            detail: 'CRITICAL BREAKING CHANGE DETECTED: quantity type changed from number -> string. Existing clients will crash on serialisation!',
          },
          {
            id: 'step_deploy',
            name: 'Deployment Gate',
            agent: 'Deployment Agent',
            description: 'Automated deployment paused. Human approval required.',
            status: 'pending',
            detail: 'Triggered approval notification in dashboard & PR check pending',
          },
        ];

  const [steps, setSteps] = useState<SimulationStep[]>(stepsConfig);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      setSteps(stepsConfig);
      return;
    }

    setSteps(stepsConfig);
    setCurrentStepIndex(0);
    setIsFinished(false);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < stepsConfig.length) {
        setCurrentStepIndex(idx);
      } else {
        clearInterval(interval);
        setIsFinished(true);
        onComplete(scenario);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isOpen, scenario]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {scenario === 'non_breaking'
                    ? 'Simulating Autonomous Code Change'
                    : 'Simulating Breaking Change & Approval Gate'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Demo API (Express)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Watch the autonomous agent pipeline detect, analyze AST, generate OpenAPI, and deploy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Code Diff Preview */}
        <div className="px-5 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileCode className="w-3.5 h-3.5 text-zinc-400" />
            <span>src/routes/orders.routes.ts:54</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-semibold">+ deliveryAddress: string</span>
            {scenario === 'breaking' && (
              <span className="text-rose-400 font-semibold font-mono">
                quantity: number → string
              </span>
            )}
          </div>
        </div>

        {/* Pipeline Step Progress */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {steps.map((step, idx) => {
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex && !isFinished;
            const isAlert = step.status === 'breaking_alert' && (isPassed || isFinished);

            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all duration-300 flex items-start gap-3.5 ${
                  isCurrent
                    ? 'bg-zinc-800/80 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                    : isAlert
                    ? 'bg-rose-950/30 border-rose-500/50'
                    : isPassed || isFinished
                    ? 'bg-zinc-900/60 border-zinc-800/90 text-zinc-300'
                    : 'bg-zinc-900/20 border-zinc-800/40 opacity-40'
                }`}
              >
                {/* Step indicator */}
                <div className="mt-0.5">
                  {isCurrent ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : isAlert ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                  ) : isPassed || isFinished ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isAlert ? 'text-rose-300' : isCurrent ? 'text-emerald-300' : 'text-zinc-200'
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-400 border border-zinc-700/60">
                        {step.agent}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
                        EXECUTING...
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mt-1">{step.description}</p>

                  {(isCurrent || isPassed || isFinished) && (
                    <div className="mt-2 p-2 rounded bg-zinc-950/80 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 flex items-start gap-2">
                      <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className={isAlert ? 'text-rose-400 font-semibold' : 'text-zinc-300'}>
                        {step.detail}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            {isFinished ? (
              scenario === 'non_breaking' ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Documentation synchronized & live!
                </span>
              ) : (
                <span className="text-rose-400 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Breaking change flagged — deployment paused for human sign-off!
                </span>
              )
            ) : (
              <span className="flex items-center gap-2 font-mono text-zinc-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Executing autonomous agent loop ({currentStepIndex + 1}/{steps.length})...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
            >
              {isFinished ? 'Close' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
