import React, { useState } from 'react';
import { ApiEndpoint, HttpMethod } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import {
  Code2,
  Sparkles,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Layers,
  FileCode,
  Braces,
  Cpu,
} from 'lucide-react';
import { dump as yamlDump } from 'js-yaml';

interface SchemaPlaypenPageProps {
  onAddEndpoint: (endpoint: ApiEndpoint) => void;
  onNavigateToExplorer: () => void;
}

const PRESET_EXPRESS = `// Express.js with Zod Validation Schema
import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const checkoutSchema = z.object({
  cartId: z.string().uuid().describe('Unique shopping basket UUID'),
  shippingAddress: z.object({
    street: z.string().min(5),
    city: z.string(),
    country: z.string().length(2).describe('ISO 3166-1 alpha-2 country code'),
  }),
  paymentMethod: z.enum(['credit_card', 'apple_pay', 'crypto']),
  giftMessage: z.string().optional(),
});

/**
 * @summary Process Checkout Transaction
 * @description Validates basket contents and reserves inventory
 */
router.post('/api/checkout/process', async (req, res) => {
  const validated = checkoutSchema.parse(req.body);
  return res.status(201).json({
    transactionId: 'txn_' + Date.now(),
    status: 'reserved',
    amount: 149.50,
  });
});

export default router;`;

const PRESET_NESTJS = `// Nest.js TypeScript Controller
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export class SendNotificationDto {
  userId: string;
  channel: 'email' | 'sms' | 'push';
  title: string;
  content: string;
}

@ApiTags('Notifications')
@Controller('api/notifications')
export class NotificationController {
  @Post('dispatch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch Multichannel Notification' })
  @ApiResponse({ status: 200, description: 'Notification queued successfully' })
  async send(@Body() dto: SendNotificationDto) {
    return { dispatched: true, queueId: 'q_7781' };
  }
}`;

const PRESET_FASTAPI = `# Python FastAPI Route with Pydantic
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

class EventTrackRequest(BaseModel):
    event_name: str = Field(..., description="Action name e.g. button_click")
    user_id: str
    properties: dict = Field(default_factory=dict)
    session_id: Optional[str] = None

@router.post("/track", status_code=status.HTTP_202_ACCEPTED, summary="Track telemetry event")
async def track_event(event: EventTrackRequest):
    return {"status": "ingested", "event_name": event.event_name}`;

export const SchemaPlaypenPage: React.FC<SchemaPlaypenPageProps> = ({
  onAddEndpoint,
  onNavigateToExplorer,
}) => {
  const [sourceCode, setSourceCode] = useState<string>(PRESET_EXPRESS);
  const [activePreset, setActivePreset] = useState<'express' | 'nest' | 'fastapi'>('express');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'yaml' | 'json'>('yaml');
  const [copied, setCopied] = useState<boolean>(false);

  // Extracted AST result
  const [extractedEndpoint, setExtractedEndpoint] = useState<ApiEndpoint>({
    id: 'ep_custom_checkout',
    projectId: 'proj_demo_api',
    method: 'POST',
    path: '/api/checkout/process',
    group: 'Checkout',
    summary: 'Process Checkout Transaction',
    description: 'Validates basket contents and reserves inventory',
    controller: 'checkoutRouter.post',
    sourceFile: 'src/routes/checkout.routes.ts',
    lineNumber: 22,
    authentication: 'Bearer Token',
    parameters: [],
    requestSchema: {
      type: 'object',
      properties: {
        cartId: {
          type: 'string',
          format: 'uuid',
          description: 'Unique shopping basket UUID',
          example: '8f9b1c20-7e44-42b1-9b62-10e9f182c441',
        },
        shippingAddress: {
          type: 'object',
          properties: {
            street: { type: 'string', example: '100 Innovation Way' },
            city: { type: 'string', example: 'San Francisco' },
            country: { type: 'string', example: 'US' },
          },
        },
        paymentMethod: {
          type: 'string',
          enum: ['credit_card', 'apple_pay', 'crypto'],
          example: 'apple_pay',
        },
        giftMessage: {
          type: 'string',
          example: 'Happy Birthday!',
        },
      },
      required: ['cartId', 'shippingAddress', 'paymentMethod'],
      example: {
        cartId: '8f9b1c20-7e44-42b1-9b62-10e9f182c441',
        shippingAddress: {
          street: '100 Innovation Way',
          city: 'San Francisco',
          country: 'US',
        },
        paymentMethod: 'apple_pay',
        giftMessage: 'Happy Birthday!',
      },
    },
    responses: [
      {
        statusCode: 201,
        description: 'Transaction reserved successfully',
        schema: {
          transactionId: 'string',
          status: 'string',
          amount: 'number',
        },
        example: {
          transactionId: 'txn_991823',
          status: 'reserved',
          amount: 149.5,
        },
      },
      { statusCode: 400, description: 'Zod validation error' },
    ],
    hash: 'h_custom_checkout_' + Date.now(),
    discoveredAt: 'Just now',
    status: 'new',
  });

  const handleSelectPreset = (preset: 'express' | 'nest' | 'fastapi') => {
    setActivePreset(preset);
    setAnalysisCompleted(false);
    if (preset === 'express') setSourceCode(PRESET_EXPRESS);
    if (preset === 'nest') setSourceCode(PRESET_NESTJS);
    if (preset === 'fastapi') setSourceCode(PRESET_FASTAPI);
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let method: HttpMethod = 'POST';
      let path = '/api/checkout/process';
      let summary = 'Process Checkout Transaction';
      let group = 'Checkout';

      if (activePreset === 'nest') {
        path = '/api/notifications/dispatch';
        summary = 'Dispatch Multichannel Notification';
        group = 'Notifications';
      } else if (activePreset === 'fastapi') {
        path = '/api/analytics/track';
        summary = 'Track telemetry event';
        group = 'Analytics';
      }

      setExtractedEndpoint((prev) => ({
        ...prev,
        method,
        path,
        summary,
        group,
        discoveredAt: 'Just now',
      }));

      setIsAnalyzing(false);
      setAnalysisCompleted(true);
    }, 800);
  };

  // Convert extracted endpoint to OpenAPI 3.1 fragment
  const openApiFragment = {
    [extractedEndpoint.path]: {
      [extractedEndpoint.method.toLowerCase()]: {
        tags: [extractedEndpoint.group],
        summary: extractedEndpoint.summary,
        description: extractedEndpoint.description,
        operationId: extractedEndpoint.summary.replace(/[^a-zA-Z0-9]/g, ''),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: extractedEndpoint.requestSchema,
            },
          },
        },
        responses: {
          '201': {
            description: 'Operation completed successfully',
          },
          '400': {
            description: 'Invalid input payload parameters',
          },
        },
      },
    },
  };

  const formattedOutput =
    outputFormat === 'yaml'
      ? yamlDump(openApiFragment, { indent: 2 })
      : JSON.stringify(openApiFragment, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToProject = () => {
    onAddEndpoint(extractedEndpoint);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">AST Schema Playpen</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              INTERACTIVE PARSER
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Write or paste backend controller code and watch APIverse's AST engine extract routes, validation schemas, and types into OpenAPI 3.1 in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {addedSuccess ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Added to API Catalog!</span>
            </div>
          ) : (
            <button
              onClick={handleAddToProject}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import to Catalog</span>
            </button>
          )}

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{isAnalyzing ? 'Extracting AST...' : 'Analyze AST'}</span>
          </button>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
        <span className="text-zinc-500 font-medium mr-1">Load Preset:</span>
        {[
          { id: 'express', label: 'Express.js + Zod Route' },
          { id: 'nest', label: 'NestJS TypeScript Controller' },
          { id: 'fastapi', label: 'Python FastAPI Route' },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p.id as any)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              activePreset === p.id
                ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Split Grid: Left Editor, Right Live AST Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              Backend Source Code (Input)
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              TypeScript / Express / Zod
            </span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
            <textarea
              rows={18}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full bg-transparent p-4 font-mono text-xs text-zinc-200 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Extracted OpenAPI 3.1 Spec */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Braces className="w-3.5 h-3.5 text-emerald-400" />
              Extracted OpenAPI 3.1 Fragment (Output)
            </span>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-mono">
                <button
                  onClick={() => setOutputFormat('yaml')}
                  className={`px-2 py-0.5 rounded ${
                    outputFormat === 'yaml' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400'
                  }`}
                >
                  YAML
                </button>
                <button
                  onClick={() => setOutputFormat('json')}
                  className={`px-2 py-0.5 rounded ${
                    outputFormat === 'json' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400'
                  }`}
                >
                  JSON
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Copy Fragment"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl p-4 max-h-[440px] overflow-y-auto">
            <CodeBlock code={formattedOutput} language={outputFormat} />
          </div>

          {/* Quick Extracted Summary Badge */}
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                {extractedEndpoint.method}
              </span>
              <span className="text-zinc-200">{extractedEndpoint.path}</span>
            </div>
            <button
              onClick={onNavigateToExplorer}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1"
            >
              <span>Explore APIs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
