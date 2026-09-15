import React, { useState } from 'react';
import { ApiEndpoint, ApiChange, Project } from '../types';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  Zap,
  Code2,
  AlertTriangle,
  Copy,
  Check,
  Layers,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoints: ApiEndpoint[];
  changes: ApiChange[];
  project: Project;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  codeSnippet?: {
    code: string;
    language: string;
  };
  timestamp: string;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  changes,
  project,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'ai',
      text: `Hello! I'm your **APIverse Schema & Documentation Copilot**. I have parsed all 42 endpoints and AST changes in **${project.name}** (v${project.lastDeployment.version}). How can I assist you with API contracts, documentation, or client SDKs?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Audit schemas for REST & security best practices',
    'How do I authenticate & call POST /api/orders?',
    'Summarize recent breaking changes & migration steps',
    'Generate a Python script to test order creation',
  ];

  const handleSendMessage = (userMessage: string) => {
    if (!userMessage.trim() || isGenerating) return;

    const newMsg: ChatMessage = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: userMessage,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponseText = '';
      let code: { code: string; language: string } | undefined = undefined;

      const lower = userMessage.toLowerCase();

      if (lower.includes('audit') || lower.includes('security') || lower.includes('best practice')) {
        aiResponseText = `### 🛡️ APIverse AST Schema & Security Audit Report

1. **Authentication Scheme**:
   - \`POST /api/auth/login\` and \`POST /api/auth/register\` correctly allow unauthenticated access.
   - All protected resources (\`/api/orders\`, \`/api/users/profile\`, \`/api/payments\`) correctly enforce Bearer JWT authentication tokens.

2. **Input Validation (OpenAPI 3.1 & Zod)**:
   - \`POST /api/orders\` defines strict required fields: \`productId\`, \`quantity\`, and \`deliveryAddress\`.
   - **Recommendation**: Add regex pattern validation for postal codes inside \`deliveryAddress\`.

3. **Status Code Semantics**:
   - Compliant with RFC 9110: Creation routes return HTTP \`201 Created\` with resource identifiers.
   - Idempotency key supported on payment gateways.`;
      } else if (lower.includes('order') || lower.includes('authenticate')) {
        aiResponseText = `To create an order on **${project.name}**, follow this two-step flow:

1. **Obtain Token**: First authenticate via \`POST /api/auth/login\` to retrieve a JWT Bearer token.
2. **Dispatch Order**: Include the token in the \`Authorization: Bearer <token>\` header and provide the required payload fields. Notice that **\`deliveryAddress\` is now required** as of commit \`a83f9c2\`.`;
        code = {
          language: 'typescript',
          code: `// Step 1: Login
const authRes = await fetch('https://api.demo-apiverse.io/v1/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'developer@example.com', password: 'SecretPassword123!' })
});
const { token } = await authRes.json();

// Step 2: Create Order
const orderRes = await fetch('https://api.demo-apiverse.io/v1/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    productId: 'prod_123',
    quantity: 2,
    deliveryAddress: 'Hyderabad, Hitec City 500081',
    customerNote: 'Leave at reception'
  })
});
const order = await orderRes.json();
console.log('Order created:', order.orderId);`,
        };
      } else if (lower.includes('breaking') || lower.includes('migration')) {
        aiResponseText = `### ⚠️ Detected Breaking Changes & Migration Guide

- **Route**: \`GET /api/products/:id\` (commit \`9f104d8\`)
- **Nature of Change**: \`pricing\` field changed from flat numeric \`number\` to structured multi-currency object \`{ base: number, currency: string }\`.
- **Client Migration Action**:
  - Legacy iOS/Android apps parsing \`json['pricing']\` as \`double\` or \`float\` will crash unless updated.
  - Temporary backward-compatibility: Send header \`X-Legacy-Pricing: true\` to receive flat numbers until client apps upgrade to SDK v1.3.9+.`;
      } else {
        aiResponseText = `I have analyzed your request regarding **${project.name}**. All schemas are actively maintained with zero drift against your Express routes. Here is a TypeScript integration snippet:`;
        code = {
          language: 'typescript',
          code: `import { DemoApiClient } from '@apiverse/sdk';

const client = new DemoApiClient({
  authToken: process.env.API_KEY,
  baseUrl: 'https://api.demo-apiverse.io/v1'
});

// Autonomously synchronized client call
const profile = await client.getUserProfile();
console.log(profile);`,
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'm_' + Date.now(),
          sender: 'ai',
          text: aiResponseText,
          codeSnippet: code,
          timestamp: 'Just now',
        },
      ]);
      setIsGenerating(false);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[640px] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-100">APIverse Schema Copilot</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AI AGENT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Ground truth AST awareness across 42 routes and active git commits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-200'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-xl max-w-[85%] space-y-2 leading-relaxed ${
                    isAi
                      ? 'bg-zinc-950/80 border border-zinc-800/80 text-zinc-200'
                      : 'bg-emerald-500 text-zinc-950 font-medium'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {m.codeSnippet && (
                    <div className="pt-2">
                      <CodeBlock
                        code={m.codeSnippet.code}
                        language={m.codeSnippet.language}
                      />
                    </div>
                  )}

                  <div
                    className={`text-[10px] font-mono ${
                      isAi ? 'text-zinc-500' : 'text-zinc-800'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono pl-10">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Analyzing AST schema graphs and contracts...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-zinc-950/40 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap shrink-0 border border-zinc-700/60 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot about endpoints, types, auth, or breaking changes..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
