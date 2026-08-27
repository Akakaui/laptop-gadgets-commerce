import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  ToggleLeft,
  ToggleRight,
  Code2,
  Share2,
  Trash2,
  X,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { SkillDefinition } from '../types';

interface SkillDirectoryProps {
  skills: SkillDefinition[];
  onSaveSkill: (skill: SkillDefinition) => void;
  onDeleteSkill: (skillId: string) => void;
}

export function SkillDirectory({ skills, onSaveSkill, onDeleteSkill }: SkillDirectoryProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('/');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [outputFormat, setOutputFormat] = useState('Markdown Brief');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !trigger.trim()) return;

    const formattedTrigger = trigger.startsWith('/') ? trigger : `/${trigger}`;

    const newSkill: SkillDefinition = {
      id: 'skill_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      commandTrigger: formattedTrigger,
      description: description.trim(),
      instructions: instructions.trim(),
      requiredCapabilities: ['prompt_synthesis'],
      allowedToolIds: [],
      outputFormat: outputFormat.trim(),
      risk: 'low',
      version: '1.0.0',
      enabled: true,
      author: 'Workspace owner'
    };

    onSaveSkill(newSkill);
    setIsCreating(false);
    setName('');
    setTrigger('/');
    setDescription('');
    setInstructions('');
  };

  const toggleSkill = (skill: SkillDefinition) => {
    onSaveSkill({ ...skill, enabled: !skill.enabled });
  };

  return (
    <div id="skill-directory-view" className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-stone-800" />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Skill & Workflow Directory
            </h1>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            Reusable instruction packages and slash commands (`/`) for repeatable research, visualization, and QA workflows.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus size={15} />
          <span>New Custom Skill</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-stone-900">Create New Reusable Skill</h3>
            <button onClick={() => setIsCreating(false)} className="text-stone-400 hover:text-stone-700">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Competitive Pricing Audit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Slash Command Trigger</label>
                <input
                  type="text"
                  placeholder="/pricing-audit"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Description</label>
              <input
                type="text"
                placeholder="What does this skill accomplish when invoked?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Instructions</label>
              <textarea
                placeholder="Detailed instructions to inject into the parent orchestrator..."
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
                Save Skill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {skill.commandTrigger}
                  </span>
                  <h4 className="font-semibold text-xs text-stone-900">{skill.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteSkill(skill.id)}
                    className="text-stone-500 hover:text-red-400"
                    title="Delete skill"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => toggleSkill(skill)}
                  className="text-stone-500 hover:text-stone-900"
                  title={skill.enabled ? 'Disable' : 'Enable'}
                >
                  {skill.enabled ? (
                    <ToggleRight size={22} className="text-emerald-700" />
                  ) : (
                    <ToggleLeft size={22} className="text-stone-300" />
                  )}
                </button>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">{skill.description}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span>Risk: {skill.risk.toUpperCase()}</span>
              <span>Author: {skill.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
