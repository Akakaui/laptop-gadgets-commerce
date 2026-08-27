import React, { useState } from 'react';
import {
  Menu,
  BrainCircuit,
  Bot,
  Search,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  Lock,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { Project, Conversation, AgentDefinition, MemoryMode } from '../types';

interface HeaderProps {
  activeProject?: Project;
  activeConversation?: Conversation;
  agents: AgentDefinition[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
  memoryMode: MemoryMode;
  onChangeMemoryMode: (mode: MemoryMode) => void;
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
}

export function Header({
  activeProject,
  activeConversation,
  agents,
  selectedAgentId,
  onSelectAgent,
  memoryMode,
  onChangeMemoryMode,
  onOpenMobileNav,
  onOpenSearch
}: HeaderProps) {
  const [showMemoryDropdown, setShowMemoryDropdown] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0] || { id: 'lattice-primary', name: 'Lattice Orchestrator', description: 'Primary agent for planning and safe task execution.', enabled: true };

  const getMemoryLabel = (mode: MemoryMode) => {
    switch (mode) {
      case 'project_only':
        return { label: 'Project memory', icon: Lock, color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 'global':
        return { label: 'Global memory', icon: Globe, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'temporary_off':
        return { label: 'Memory off', icon: BrainCircuit, color: 'text-stone-600 bg-stone-100 border-stone-200' };
      default:
        return { label: 'Conversation only', icon: BrainCircuit, color: 'text-stone-600 bg-stone-100 border-stone-200' };
    }
  };

  const currentMem = getMemoryLabel(memoryMode);
  const MemIcon = currentMem.icon;

  return (
    <header
      id="app-header"
      className="h-14 border-b border-stone-200 bg-stone-50/80 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0 select-none"
    >
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="mobile-nav-toggle-btn"
          onClick={onOpenMobileNav}
          className="md:hidden p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors"
          title="Open Navigation"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 min-w-0 text-xs">
          {activeProject ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-stone-900 truncate">
                {activeProject.name}
              </span>
              <span className="text-stone-400">/</span>
              <span className="text-stone-600 truncate">
                {activeConversation?.title || 'Active Session'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
                Standalone
              </span>
              <span className="font-medium text-stone-800 truncate">
                {activeConversation?.title || 'New conversation'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Memory Pill, Agent Picker, Artifact Toggle */}
      <div className="flex items-center gap-2">
        {/* Memory Mode Dropdown */}
        <div className="relative">
          <button
            id="memory-mode-pill-btn"
            onClick={() => setShowMemoryDropdown(!showMemoryDropdown)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${currentMem.color}`}
            title="Inspect Memory Governance"
          >
            <MemIcon size={13} />
            <span className="hidden sm:inline">{currentMem.label}</span>
            <ChevronDown size={12} className="opacity-70" />
          </button>

          {showMemoryDropdown && (
            <div
              className="absolute right-0 top-9 z-50 w-64 bg-white border border-stone-200 rounded-xl shadow-lg p-2 text-xs space-y-1"
              onMouseLeave={() => setShowMemoryDropdown(false)}
            >
              <div className="px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Context & Memory Scope
              </div>
              <button
                onClick={() => {
                  onChangeMemoryMode('project_only');
                  setShowMemoryDropdown(false);
                }}
                className={`w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors ${
                  memoryMode === 'project_only' ? 'bg-orange-50 text-orange-900 font-medium' : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Lock size={14} className="mt-0.5 text-orange-700 shrink-0" />
                <div>
                  <p className="text-xs">Project-Only Isolation</p>
                  <p className="text-[10px] text-stone-500">Only uses current project sources, chats, and instructions.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onChangeMemoryMode('global');
                  setShowMemoryDropdown(false);
                }}
                className={`w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors ${
                  memoryMode === 'global' ? 'bg-emerald-50 text-emerald-900 font-medium' : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Globe size={14} className="mt-0.5 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-xs">Global Memory Active</p>
                  <p className="text-[10px] text-stone-500">Uses verified global preferences and long-term context.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onChangeMemoryMode('temporary_off');
                  setShowMemoryDropdown(false);
                }}
                className={`w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors ${
                  memoryMode === 'temporary_off' ? 'bg-stone-100 text-stone-900 font-medium' : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <BrainCircuit size={14} className="mt-0.5 text-stone-500 shrink-0" />
                <div>
                  <p className="text-xs">Temporary Memory-Off</p>
                  <p className="text-[10px] text-stone-500">Strictly isolated to this turn; zero persistent memory written.</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Selected Agent Picker */}
        <div className="relative">
          <button
            id="agent-picker-btn"
            onClick={() => setShowAgentDropdown(!showAgentDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium transition-colors shadow-2xs"
          >
            <Bot size={13} className="text-stone-600" />
            <span className="hidden md:inline truncate max-w-[130px]">{selectedAgent.name}</span>
            <ChevronDown size={12} className="text-stone-400" />
          </button>

          {showAgentDropdown && (
            <div
              className="absolute right-0 top-9 z-50 w-72 bg-white border border-stone-200 rounded-xl shadow-lg p-2 text-xs space-y-1"
              onMouseLeave={() => setShowAgentDropdown(false)}
            >
              <div className="px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Select Active Orchestrator / Specialist
              </div>
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    onSelectAgent(agent.id);
                    setShowAgentDropdown(false);
                  }}
                  className={`w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors ${
                    agent.id === selectedAgentId ? 'bg-stone-100 font-medium text-stone-900' : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Bot size={14} className="mt-0.5 text-stone-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs truncate">{agent.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{agent.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Button */}
        <button
          id="global-search-btn"
          onClick={onOpenSearch}
          className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          title="Search Workspaces & Artifacts (Ctrl/Cmd+K)"
        >
          <Search size={15} />
        </button>

      </div>
    </header>
  );
}
