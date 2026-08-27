import React, { useState } from 'react';
import {
  BrainCircuit,
  Search,
  Trash2,
  Lock,
  Globe,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Info,
  Check,
  Plus
} from 'lucide-react';
import { MemoryItem, UserProfile, Project } from '../types';

interface MemoryManagerProps {
  memories: MemoryItem[];
  user: UserProfile;
  projects: Project[];
  onToggleGlobalMemory: () => void;
  onSaveMemory: (item: MemoryItem) => void;
  onDeleteMemory: (id: string) => void;
  onClearAllMemories: () => void;
}

export function MemoryManager({
  memories,
  user,
  projects,
  onToggleGlobalMemory,
  onSaveMemory,
  onDeleteMemory,
  onClearAllMemories
}: MemoryManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newStatement, setNewStatement] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('communication_preference');
  const [newScope, setNewScope] = useState<'global' | 'project_only'>('global');
  const [targetProjId, setTargetProjId] = useState<string>('');

  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      m.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.reasonSaved.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;

    const newMem: MemoryItem = {
      id: 'mem_' + Math.random().toString(36).substring(2, 9),
      statement: newStatement.trim(),
      category: newCategory,
      scope: newScope,
      projectId: newScope === 'project_only' ? targetProjId || undefined : undefined,
      sourceConversationId: 'manual_entry',
      confidence: 1.0,
      createdAt: new Date().toISOString(),
      reasonSaved: 'Manually defined by user in Memory Settings.'
    };

    onSaveMemory(newMem);
    setIsAdding(false);
    setNewStatement('');
  };

  return (
    <div id="memory-manager-view" className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header & Global Toggle */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BrainCircuit size={20} className="text-stone-800" />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Persistent Memory Governance
            </h1>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            Lattice allows user-governed long-term memory. When disabled, zero new memories are recorded or retrieved. Project-only memories never leak across workspaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="font-semibold text-stone-700">Global Memory:</span>
            <button
              onClick={onToggleGlobalMemory}
              className="text-stone-700"
              title={user.globalMemoryEnabled ? 'Disable Global Memory' : 'Enable Global Memory'}
            >
              {user.globalMemoryEnabled ? (
                <ToggleRight size={24} className="text-emerald-700" />
              ) : (
                <ToggleLeft size={24} className="text-stone-400" />
              )}
            </button>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus size={14} />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Manual Memory Form */}
      {isAdding && (
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-stone-900">Add Memory Preference or Constraint</h3>
            <button onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-700">
              ✕
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Memory Statement</label>
              <input
                type="text"
                placeholder="e.g. Always generate ISO-20022 schemas in payment briefs."
                value={newStatement}
                onChange={(e) => setNewStatement(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none"
                >
                  <option value="communication_preference">Communication Preference</option>
                  <option value="technical_constraint">Technical Constraint</option>
                  <option value="project_fact">Project Fact</option>
                  <option value="identity_context">Identity Context</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Scope</label>
                <select
                  value={newScope}
                  onChange={(e: any) => setNewScope(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none"
                >
                  <option value="global">Global Scope</option>
                  <option value="project_only">Project-Only Scope</option>
                </select>
              </div>

              {newScope === 'project_only' && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Target Project</label>
                  <select
                    value={targetProjId}
                    onChange={(e) => setTargetProjId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newStatement.trim()}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 disabled:opacity-40"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Clear All */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search verified memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-900 shadow-2xs"
          />
        </div>

        {memories.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to forget and clear all stored memories?')) {
                onClearAllMemories();
              }
            }}
            className="text-xs text-red-600 hover:text-red-800 font-medium self-end sm:self-center"
          >
            Clear All Memories
          </button>
        )}
      </div>

      {/* Memories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-2xl">
            No memories stored.
          </div>
        ) : (
          filteredMemories.map((mem) => {
            const project = projects.find((p) => p.id === mem.projectId);
            return (
              <div
                key={mem.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-100 text-stone-700">
                      {mem.category.replace('_', ' ')}
                    </span>

                    <span
                      className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded uppercase ${
                        mem.scope === 'project_only'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {mem.scope === 'project_only' ? `Project: ${project?.name || 'Isolated'}` : 'Global'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-900 font-medium leading-relaxed">
                    "{mem.statement}"
                  </p>

                  <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                    Why saved: {mem.reasonSaved}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>Confidence: {(mem.confidence * 100).toFixed(0)}%</span>
                  <button
                    onClick={() => onDeleteMemory(mem.id)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                    title="Forget / Delete Memory"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
