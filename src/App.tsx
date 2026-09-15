/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  initialProject,
  initialEndpoints,
  initialChanges,
  initialAgentExecutions,
  initialDeployments,
} from './data/mockData';
import { Project, ApiEndpoint, ApiChange, AgentExecution, Deployment } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SimulationModal } from './components/SimulationModal';
import { AiCopilotModal } from './components/AiCopilotModal';
import { CommandPalette } from './components/CommandPalette';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { ApiExplorerPage } from './pages/ApiExplorerPage';
import { ApiDetailsPage } from './pages/ApiDetailsPage';
import { ChangesPage } from './pages/ChangesPage';
import { ChangeDetailsPage } from './pages/ChangeDetailsPage';
import { AgentActivityPage } from './pages/AgentActivityPage';
import { OpenApiPage } from './pages/OpenApiPage';
import { MockServerPage } from './pages/MockServerPage';
import { SdkStudioPage } from './pages/SdkStudioPage';
import { ContractTestsPage } from './pages/ContractTestsPage';
import { SchemaPlaypenPage } from './pages/SchemaPlaypenPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { DeploymentsPage } from './pages/DeploymentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Menu } from 'lucide-react';
import { loadProjectData } from './services/api';

export default function App() {
  const [project, setProject] = useState<Project>(initialProject);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(initialEndpoints);
  const [changes, setChanges] = useState<ApiChange[]>(initialChanges);
  const [agentExecutions, setAgentExecutions] = useState<AgentExecution[]>(initialAgentExecutions);
  const [deployments, setDeployments] = useState<Deployment[]>(initialDeployments);

  const [activePage, setActivePage] = useState<string>('dashboard');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [selectedChange, setSelectedChange] = useState<ApiChange | null>(null);

  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [simulationScenario, setSimulationScenario] = useState<'non_breaking' | 'breaking'>('non_breaking');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Backend data is optional during local frontend development; mocks remain the fallback.
  useEffect(() => {
    loadProjectData().then((data) => {
      setProject(data.project);
      setEndpoints(data.endpoints.length ? data.endpoints : initialEndpoints);
      setChanges(data.changes.length ? data.changes : initialChanges);
      setAgentExecutions(data.agentExecutions.length ? data.agentExecutions : initialAgentExecutions);
      setDeployments(data.deployments.length ? data.deployments : initialDeployments);
    }).catch(() => undefined);
  }, []);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler for adding custom endpoint from SchemaPlaypenPage
  const handleAddEndpoint = (newEndpoint: ApiEndpoint) => {
    setEndpoints((prev) => [newEndpoint, ...prev]);
    setProject((prev) => ({ ...prev, apiCount: prev.apiCount + 1 }));
  };

  // Trigger demo simulation modal
  const handleTriggerSimulation = (scenario: 'non_breaking' | 'breaking') => {
    setSimulationScenario(scenario);
    setIsSimulationOpen(true);
  };

  // Complete simulation update
  const handleSimulationComplete = (scenario: 'non_breaking' | 'breaking') => {
    if (scenario === 'non_breaking') {
      // 1. Update POST /api/orders requestSchema with deliveryAddress and customerNote
      setEndpoints((prev) =>
        prev.map((ep) => {
          if (ep.id === 'ep_orders_create') {
            return {
              ...ep,
              status: 'modified',
              requestSchema: {
                ...ep.requestSchema,
                required: ['productId', 'quantity', 'deliveryAddress'],
                properties: {
                  ...ep.requestSchema?.properties,
                  deliveryAddress: {
                    type: 'string',
                    description: 'Physical shipping destination address',
                  },
                  customerNote: {
                    type: 'string',
                    description: 'Optional delivery instructions for courier',
                  },
                },
                example: {
                  productId: 'prod_123',
                  quantity: 2,
                  deliveryAddress: 'Hyderabad, Hitec City 500081',
                  customerNote: 'Leave with reception',
                },
              },
            };
          }
          return ep;
        })
      );

      // 2. Update Project Stats
      setProject((prev) => ({
        ...prev,
        documentedCount: Math.min(prev.apiCount, prev.documentedCount + 1),
        changesCount: prev.changesCount + 1,
        lastScan: 'Just now',
        lastCommit: {
          hash: 'a83f9c2',
          message: 'feat(orders): add deliveryAddress and customerNote to order payload',
          author: 'alex.chen@devtools.io',
          timestamp: 'Just now',
        },
        lastDeployment: {
          version: 'v1.4.1',
          status: 'success',
          timestamp: 'Just now',
        },
      }));

      // 3. Prepend newly generated deployment
      setDeployments((prev) => [
        {
          id: 'dep_' + Date.now(),
          version: 'v1.4.1',
          commitHash: 'a83f9c2',
          status: 'success',
          deployedAt: 'Just now',
          endpointCount: 42,
          triggeredBy: 'Agent Git Hook',
        },
        ...prev,
      ]);
    } else {
      // Breaking change simulation
      setEndpoints((prev) =>
        prev.map((ep) => {
          if (ep.id === 'ep_orders_create') {
            return {
              ...ep,
              status: 'breaking',
              requestSchema: {
                ...ep.requestSchema,
                properties: {
                  ...ep.requestSchema?.properties,
                  quantity: {
                    type: 'string',
                    description: 'Quantity as string code [BREAKING TYPE MUTATION]',
                  },
                },
              },
            };
          }
          return ep;
        })
      );

      setProject((prev) => ({
        ...prev,
        breakingCount: prev.breakingCount + 1,
        changesCount: prev.changesCount + 1,
        lastScan: 'Just now',
      }));

      // Prepend breaking change record
      const breakingChangeRecord: ApiChange = {
        id: 'chg_breaking_' + Date.now(),
        endpoint: '/api/orders',
        method: 'POST',
        changeType: 'modified',
        severity: 'critical',
        breaking: true,
        detectedAt: 'Just now',
        description:
          'CRITICAL BREAKING CHANGE: Payload field "quantity" mutated from integer to string. Client SDK serialization mismatch.',
        diffFields: [
          {
            field: 'quantity',
            changeType: 'type_changed',
            oldValue: 'number',
            newValue: 'string',
            description: 'Incompatible type modification breaks JSON contracts for iOS/Android apps',
          },
        ],
        commit: {
          hash: '9f104d8',
          message: 'refactor(orders): change quantity type from number to string',
          author: 'dev@example.com',
          timestamp: 'Just now',
        },
        status: 'pending_approval',
        beforePayload: { productId: 'prod_123', quantity: 2 },
        afterPayload: { productId: 'prod_123', quantity: '2' },
      };

      setChanges((prev) => [breakingChangeRecord, ...prev]);
    }
  };

  // Human approval of breaking change
  const handleApproveBreakingChange = (changeId: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, status: 'deployed' } : c))
    );
    setProject((prev) => ({
      ...prev,
      breakingCount: Math.max(0, prev.breakingCount - 1),
      lastDeployment: {
        version: 'v1.5.0',
        status: 'success',
        timestamp: 'Just now',
      },
    }));
    setDeployments((prev) => [
      {
        id: 'dep_' + Date.now(),
        version: 'v1.5.0',
        commitHash: '9f104d8',
        status: 'success',
        deployedAt: 'Just now',
        endpointCount: 42,
        triggeredBy: 'Human Approval Gate',
      },
      ...prev,
    ]);
  };

  // Rollback deployment handler
  const handleRollback = (version: string) => {
    setProject((prev) => ({
      ...prev,
      lastDeployment: {
        version,
        status: 'success',
        timestamp: 'Just now',
      },
    }));
  };

  // Scan repository
  const handleScanRepository = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setProject((prev) => ({ ...prev, lastScan: 'Just now' }));
    }, 1200);
  };

  // Reset demo back to clean initial state
  const handleResetDemo = () => {
    setProject(initialProject);
    setEndpoints(initialEndpoints);
    setChanges(initialChanges);
    setAgentExecutions(initialAgentExecutions);
    setDeployments(initialDeployments);
    setSelectedEndpoint(null);
    setSelectedChange(null);
    setActivePage('dashboard');
  };

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setActivePage('api-details');
  };

  const handleSelectChange = (chg: ApiChange) => {
    setSelectedChange(chg);
    setActivePage('change-details');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        project={project}
        changes={changes}
        onTriggerSimulation={handleTriggerSimulation}
        onResetDemo={handleResetDemo}
        activePage={activePage}
        onNavigate={setActivePage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAiCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex">
        {/* Mobile menu trigger bar */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="w-12 h-12 rounded-full bg-emerald-500 text-zinc-950 shadow-xl flex items-center justify-center font-bold"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            if (page === 'apis') setSelectedEndpoint(null);
            if (page === 'changes') setSelectedChange(null);
          }}
          onOpenAiCopilot={() => setIsCopilotOpen(true)}
          project={project}
          changesCount={changes.length}
          breakingCount={project.breakingCount}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto w-full">
          {activePage === 'landing' && (
            <LandingPage
              onGoToDemo={() => setActivePage('dashboard')}
              onOpenConnectModal={() => setActivePage('repositories')}
            />
          )}

          {activePage === 'dashboard' && (
            <DashboardPage
              project={project}
              changes={changes}
              agentExecutions={agentExecutions}
              onNavigate={(page) => {
                setActivePage(page);
              }}
              onTriggerSimulation={handleTriggerSimulation}
            />
          )}

          {activePage === 'repositories' && (
            <RepositoriesPage
              project={project}
              onNavigate={setActivePage}
              onScanRepository={handleScanRepository}
              isScanning={isScanning}
            />
          )}

          {activePage === 'apis' && (
            <ApiExplorerPage
              endpoints={endpoints}
              onSelectEndpoint={handleSelectEndpoint}
              searchQuery={searchQuery}
            />
          )}

          {activePage === 'api-details' && (
            <ApiDetailsPage
              endpoint={selectedEndpoint || endpoints[0]}
              onBack={() => setActivePage('apis')}
              onNavigateToChanges={() => setActivePage('changes')}
            />
          )}

          {activePage === 'changes' && (
            <ChangesPage
              changes={changes}
              onSelectChange={handleSelectChange}
              onApproveBreakingChange={handleApproveBreakingChange}
            />
          )}

          {activePage === 'change-details' && (
            <ChangeDetailsPage
              change={selectedChange || changes[0]}
              onBack={() => setActivePage('changes')}
              onApprove={handleApproveBreakingChange}
            />
          )}

          {activePage === 'agents' && (
            <AgentActivityPage
              executions={agentExecutions}
              onTriggerSimulation={handleTriggerSimulation}
            />
          )}

          {activePage === 'openapi' && (
            <OpenApiPage
              endpoints={endpoints}
              projectName={project.name}
              version={project.lastDeployment.version}
            />
          )}

          {activePage === 'mock-server' && (
            <MockServerPage endpoints={endpoints} />
          )}

          {activePage === 'sdks' && (
            <SdkStudioPage endpoints={endpoints} projectName={project.name} />
          )}

          {activePage === 'contract-tests' && (
            <ContractTestsPage endpoints={endpoints} />
          )}

          {activePage === 'playpen' && (
            <SchemaPlaypenPage
              onAddEndpoint={handleAddEndpoint}
              onNavigateToExplorer={() => setActivePage('apis')}
            />
          )}

          {activePage === 'changelog' && (
            <ChangelogPage
              changes={changes}
              deployments={deployments}
              projectName={project.name}
            />
          )}

          {activePage === 'deployments' && (
            <DeploymentsPage
              deployments={deployments}
              onRollback={handleRollback}
              onOpenLiveDocs={() => setActivePage('openapi')}
            />
          )}

          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Simulation Modal (Triggered by Simulate Code Change or Breaking Demo) */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        scenario={simulationScenario}
        onComplete={handleSimulationComplete}
      />

      {/* Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page) => setActivePage(page)}
        onSelectEndpoint={(ep) => handleSelectEndpoint(ep)}
        onTriggerSimulation={handleTriggerSimulation}
        onOpenAiCopilot={() => setIsCopilotOpen(true)}
        endpoints={endpoints}
      />

      {/* AI Schema & Documentation Copilot */}
      <AiCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        endpoints={endpoints}
        changes={changes}
        project={project}
      />
    </div>
  );
}
