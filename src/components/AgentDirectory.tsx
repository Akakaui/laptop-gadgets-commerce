import React, { useState } from 'react';
import {
  Users,
  Bot,
  Plus,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { AgentDefinition, SpecialistRole } from '../types';

interface AgentDirectoryProps {
  agents: AgentDefinition[];
  onSaveAgent: (agent: AgentDefinition) => void;
  onDeleteAgent: (agentId: string) => void;
}

export function AgentDirectory({ agents, onSaveAgent, onDeleteAgent }: AgentDirectoryProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [roleType, setRoleType] = useState<'main' | 'subagent' | 'both'>('subagent');
  const [specialty, setSpecialty] = useState<SpecialistRole>('researcher');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: AgentDefinition = {
      id: 'agent_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      description: description.trim() || 'Custom specialist agent definition.',
      mark: 'bot',
      roleType,
      specialty,
      systemInstructions: instructions.trim() || 'Follow the parent orchestrator guidance strictly.',
      modelPolicy: 'gemini-2.5-flash',
      allowedSkillIds: [],
      allowedToolIds: ['tool_exa_search'],
      memoryPolicy: 'project_only',
      approvalPolicy: {
        automaticLowRisk: true,
        askMediumRisk: true,
        alwaysConfirmHighRisk: true
      },
      enabled: true,
      version: '1.0.0'
    };

    onSaveAgent(newAgent);
    setIsCreating(false);
    setName('');
    setDescription('');
    setInstructions('');
  };

  const toggleAgent = (agent: AgentDefinition) => {
    onSaveAgent({ ...agent, enabled: !agent.enabled });
  };

  return (
    <div id="agent-directory-view" className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-stone-800" />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Agent & Specialist Directory
            </h1>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            Configure parent orchestrators and bounded specialist subagents with strict tool allowlists, memory boundaries, and risk policies.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus size={15} />
          <span>New Specialist Agent</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-stone-900">Define New Agent Policy</h3>
            <button onClick={() => setIsCreating(false)} className="text-stone-400 hover:text-stone-700">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Agent Name</label>
                <input
                  type="text"
                  placeholder="e.g. Legal Compliance Auditor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Role Type</label>
                <select
                  value={roleType}
                  onChange={(e: any) => setRoleType(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                >
                  <option value="main">Main (Can own conversations)</option>
                  <option value="subagent">Subagent (Delegated tasks only)</option>
                  <option value="both">Both (Main & Subagent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Description</label>
              <input
                type="text"
                placeholder="What is this specialist's role in the parent graph?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">System Instructions</label>
              <textarea
                placeholder="Declare instructions, constraints, and prohibited actions..."
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 disabled:opacity-40"
              >
                Save Agent
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                    <Bot size={15} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-stone-900">{agent.name}</h4>
                    <span className="text-[10px] font-mono text-stone-400">v{agent.version}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 uppercase font-semibold">
                    {agent.roleType}
                  </span>
                  {agent.id !== 'agent_main_default' && <button
                    onClick={() => onDeleteAgent(agent.id)}
                    className="text-stone-500 hover:text-red-400"
                    title="Delete agent"
                  >
                    <Trash2 size={15} />
                  </button>}
                  <button
                    onClick={() => toggleAgent(agent)}
                    className="text-stone-500 hover:text-stone-900"
                    title={agent.enabled ? 'Disable' : 'Enable'}
                  >
                    {agent.enabled ? (
                      <ToggleRight size={22} className="text-emerald-700" />
                    ) : (
                      <ToggleLeft size={22} className="text-stone-300" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">{agent.description}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span>Model: {agent.modelPolicy}</span>
              <span>Tools: {agent.allowedToolIds.length || 'Zero Native Tools'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
