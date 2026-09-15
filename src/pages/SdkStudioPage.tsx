import React, { useState } from 'react';
import { ApiEndpoint } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import {
  Code2,
  Download,
  Copy,
  Check,
  Sparkles,
  Terminal,
  Settings2,
  FileCode,
  Layers,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface SdkStudioPageProps {
  endpoints: ApiEndpoint[];
  projectName: string;
}

type SdkLanguage = 'ts_fetch' | 'ts_axios' | 'python' | 'go' | 'curl' | 'java';

export const SdkStudioPage: React.FC<SdkStudioPageProps> = ({ endpoints, projectName }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SdkLanguage>('ts_fetch');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('all');
  const [environment, setEnvironment] = useState<'production' | 'staging' | 'mock'>('production');
  const [copied, setCopied] = useState(false);

  const endpoint = endpoints.find((e) => e.id === selectedEndpointId);

  const getBaseUrl = () => {
    switch (environment) {
      case 'staging':
        return 'https://staging-api.demo-apiverse.io/v1';
      case 'mock':
        return 'https://mock.apiverse.dev/v1';
      default:
        return 'https://api.demo-apiverse.io/v1';
    }
  };

  const baseUrl = getBaseUrl();

  // Generate code dynamically based on selected language and endpoint
  const generateCode = (): string => {
    if (selectedLanguage === 'ts_fetch') {
      if (selectedEndpointId === 'all') {
        return `/**
 * Generated autonomously by APIverse SDK Studio for ${projectName}
 * Target Spec: OpenAPI 3.1.0
 * Environment: ${environment}
 */

export interface ApiClientConfig {
  baseUrl?: string;
  apiKey?: string;
  authToken?: string;
}

export class ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Client {
  private baseUrl: string;
  private token?: string;

  constructor(config?: ApiClientConfig) {
    this.baseUrl = config?.baseUrl || '${baseUrl}';
    this.token = config?.authToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = \`Bearer \${this.token}\`;
    }

    const response = await fetch(\`\${this.baseUrl}\${path}\`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(\`API Error \${response.status}: \${errBody}\`);
    }

    return response.json();
  }

  // Authentication
  async login(payload: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Orders
  async createOrder(payload: {
    productId: string;
    quantity: number;
    deliveryAddress: string;
    customerNote?: string;
  }) {
    return this.request<{ orderId: string; status: string; total: number }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Products
  async getProduct(id: string) {
    return this.request<{ id: string; title: string; pricing: any }>(\`/api/products/\${id}\`, {
      method: 'GET',
    });
  }
}

// Example Usage:
// const client = new ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Client({ authToken: 'your-jwt-token' });
// const order = await client.createOrder({
//   productId: 'prod_123',
//   quantity: 2,
//   deliveryAddress: 'Hyderabad, Hitec City 500081'
// });
`;
      } else if (endpoint) {
        return `// Type-safe Fetch snippet for ${endpoint.method} ${endpoint.path}
interface ${endpoint.id.toUpperCase()}_Request {
  productId: string;
  quantity: number;
  deliveryAddress: string;
  customerNote?: string;
}

export async function call${endpoint.summary.replace(/[^a-zA-Z0-9]/g, '')}(
  body: ${endpoint.id.toUpperCase()}_Request,
  token?: string
) {
  const response = await fetch('${baseUrl}${endpoint.path}', {
    method: '${endpoint.method}',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(\`Request failed with status \${response.status}\`);
  }

  return response.json();
}`;
      }
    }

    if (selectedLanguage === 'ts_axios') {
      return `import axios, { AxiosInstance } from 'axios';

/**
 * Axios client for ${projectName} (OpenAPI 3.1)
 */
export const createApiClient = (authToken?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: '${baseUrl}',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (authToken) {
    client.interceptors.request.use((config) => {
      config.headers.Authorization = \`Bearer \${authToken}\`;
      return config;
    });
  }

  return client;
};

// Example Dispatch:
// const api = createApiClient('eyJhbGciOi...');
// const res = await api.post('/api/orders', {
//   productId: 'prod_123',
//   quantity: 2,
//   deliveryAddress: 'Hyderabad, Hitec City 500081',
// });
// console.log(res.data);
`;
    }

    if (selectedLanguage === 'python') {
      return `"""
Autonomous Python SDK generated by APIverse for ${projectName}
Compatible with Pydantic v2 and HTTPX / Requests
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
import httpx

class CreateOrderRequest(BaseModel):
    product_id: str = Field(..., description="Unique product SKU identifier")
    quantity: int = Field(..., ge=1, description="Quantity of units requested")
    delivery_address: str = Field(..., description="Shipping destination address")
    customer_note: Optional[str] = None

class ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Client:
    def __init__(self, token: Optional[str] = None, base_url: str = "${baseUrl}"):
        self.base_url = base_url
        self.headers = {"Content-Type": "application/json"}
        if token:
            self.headers["Authorization"] = f"Bearer {token}"

    def create_order(self, order: CreateOrderRequest) -> Dict[str, Any]:
        with httpx.Client(base_url=self.base_url, headers=self.headers) as client:
            response = client.post("/api/orders", json=order.model_dump())
            response.raise_for_status()
            return response.json()

    def get_product(self, product_id: str) -> Dict[str, Any]:
        with httpx.Client(base_url=self.base_url, headers=self.headers) as client:
            response = client.get(f"/api/products/{product_id}")
            response.raise_for_status()
            return response.json()

# Usage:
# client = ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Client(token="jwt-token-here")
# order = CreateOrderRequest(product_id="prod_123", quantity=2, delivery_address="Hitec City")
# result = client.create_order(order)
# print(result)
`;
    }

    if (selectedLanguage === 'go') {
      return `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type OrderPayload struct {
	ProductID       string \`json:"productId"\`
	Quantity        int    \`json:"quantity"\`
	DeliveryAddress string \`json:"deliveryAddress"\`
	CustomerNote    string \`json:"customerNote,omitempty"\`
}

type Client struct {
	BaseURL    string
	AuthToken  string
	HTTPClient *http.Client
}

func NewClient(token string) *Client {
	return &Client{
		BaseURL:   "${baseUrl}",
		AuthToken: token,
		HTTPClient: &http.Client{Timeout: 10 * time.Second},
	}
}

func (c *Client) CreateOrder(payload OrderPayload) (map[string]interface{}, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", c.BaseURL+"/api/orders", bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	if c.AuthToken != "" {
		req.Header.Set("Authorization", "Bearer "+c.AuthToken)
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}
`;
    }

    if (selectedLanguage === 'curl') {
      const ep = endpoint || endpoints[0];
      return `# APIverse cURL Dispatch for ${ep.method} ${ep.path}
curl -X ${ep.method} "${baseUrl}${ep.path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -d '{
    "productId": "prod_123",
    "quantity": 2,
    "deliveryAddress": "Hyderabad, Hitec City 500081",
    "customerNote": "Leave at reception"
  }'`;
    }

    // Java
    return `package dev.apiverse.client;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Client {
    private final String baseUrl = "${baseUrl}";
    private final HttpClient client;
    private final String authToken;

    public ${projectName.replace(/[^a-zA-Z0-9]/g, '')}Client(String token) {
        this.authToken = token;
        this.client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String createOrder(String jsonPayload) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/orders"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + authToken)
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
`;
  };

  const codeString = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let extension = 'ts';
    if (selectedLanguage === 'python') extension = 'py';
    if (selectedLanguage === 'go') extension = 'go';
    if (selectedLanguage === 'curl') extension = 'sh';
    if (selectedLanguage === 'java') extension = 'java';

    const filename = `apiverse-client.${extension}`;
    const blob = new Blob([codeString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Client SDK Studio</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              MULTI-LANGUAGE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Autonomously generate type-safe client libraries, API wrappers, and request models directly from your live OpenAPI 3.1 specification.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SDK File</span>
          </button>
        </div>
      </div>

      {/* Language Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        {[
          { id: 'ts_fetch', label: 'TypeScript (Fetch)' },
          { id: 'ts_axios', label: 'TypeScript (Axios)' },
          { id: 'python', label: 'Python (Pydantic / HTTPX)' },
          { id: 'go', label: 'Go (net/http)' },
          { id: 'curl', label: 'cURL / Shell' },
          { id: 'java', label: 'Java 17+ (HttpClient)' },
        ].map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id as SdkLanguage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* Configuration Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs">
        {/* Scope Selector */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-medium block">Generation Scope</label>
          <select
            value={selectedEndpointId}
            onChange={(e) => setSelectedEndpointId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono text-[11px] focus:outline-none"
          >
            <option value="all">Full Client SDK (All 42 Endpoints)</option>
            {endpoints.map((ep) => (
              <option key={ep.id} value={ep.id}>
                Snippet: [{ep.method}] {ep.path}
              </option>
            ))}
          </select>
        </div>

        {/* Target Environment */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-medium block">Target Gateway Server</label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as any)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono text-[11px] focus:outline-none"
          >
            <option value="production">Production (https://api.demo-apiverse.io/v1)</option>
            <option value="staging">Staging (https://staging-api.demo-apiverse.io/v1)</option>
            <option value="mock">Autonomous Mock Server (https://mock.apiverse.dev/v1)</option>
          </select>
        </div>

        {/* Quick install command */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-medium block">Package Manager</label>
          <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-zinc-300">
            <span className="truncate">
              {selectedLanguage.startsWith('ts')
                ? 'npm i @apiverse/sdk'
                : selectedLanguage === 'python'
                ? 'pip install apiverse-client'
                : selectedLanguage === 'go'
                ? 'go get github.com/apiverse/client-go'
                : 'curl -sSL https://get.apiverse.dev'}
            </span>
            <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1.5" />
          </div>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-zinc-300 font-medium">
              {selectedLanguage === 'ts_fetch'
                ? 'src/client.ts'
                : selectedLanguage === 'ts_axios'
                ? 'src/apiClient.ts'
                : selectedLanguage === 'python'
                ? 'client.py'
                : selectedLanguage === 'go'
                ? 'client.go'
                : selectedLanguage === 'curl'
                ? 'request.sh'
                : 'ApiClient.java'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span>OpenAPI 3.1.0</span>
            <span>•</span>
            <span className="text-emerald-400">Type-Safe</span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto text-xs font-mono">
          <CodeBlock
            code={codeString}
            language={
              selectedLanguage.startsWith('ts')
                ? 'typescript'
                : selectedLanguage === 'python'
                ? 'python'
                : selectedLanguage === 'go'
                ? 'go'
                : selectedLanguage === 'curl'
                ? 'bash'
                : 'java'
            }
          />
        </div>
      </div>
    </div>
  );
};
