import { useState, useEffect } from 'react';
import {
  Search,
  Bot,
  Sparkles,
  Layers,
  Calendar,
  Radio,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SkillDefinition, AgentDefinition, RemoteMcpConnector } from '../types';

interface SlashCommandItem {
  id: string;
  command: string;
  title: string;
  category: 'Specialist Subagents' | 'Skills & Workflows' | 'Connectors (MCP)' | 'Actions';
  description: string;
  risk: 'low' | 'medium' | 'high';
  permissions: string[];
  outputFormat: string;
  icon: any;
}

interface SlashCommandPaletteProps {
  isOpen: boolean;
  query: string;
  onSelectCommand: (command: string, templateText?: string) => void;
  onClose: () => void;
  skills: SkillDefinition[];
  agents: AgentDefinition[];
  connectors: RemoteMcpConnector[];
}

export function SlashCommandPalette({
  isOpen,
  query,
  onSelectCommand,
  onClose,
  skills,
  agents,
  connectors
}: SlashCommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  // Build command catalogue
  const allItems: SlashCommandItem[] = [
    // Skills
    ...skills.map((s) => ({
      id: s.id,
      command: s.commandTrigger,
      title: s.name,
      category: 'Skills & Workflows' as const,
      description: s.description,
      risk: (s.risk === 'high' || s.risk === 'medium' ? s.risk : 'low') as 'low' | 'medium' | 'high',
      permissions: s.requiredCapabilities || [],
      outputFormat: s.outputFormat || 'Structured output',
      icon: Sparkles
    })),
    // Built-in actions
    {
      id: 'act_diagram',
      command: '/diagram',
      title: 'Generate Mermaid Architecture Diagram',
      category: 'Actions' as const,
      description: 'Synthesize a valid flowchart, sequence, or state diagram.',
      risk: 'low',
      permissions: ['mermaid_rendering'],
      outputFormat: 'Mermaid Vector Artifact',
      icon: Layers
    },
    {
      id: 'act_html',
      command: '/preview',
      title: 'Render Interactive HTML/UI Component',
      category: 'Actions' as const,
      description: 'Build a sandboxed interactive UI preview component with CSS & JS.',
      risk: 'low',
      permissions: ['sandboxed_html_preview'],
      outputFormat: 'HTML Preview Artifact',
      icon: FileText
    },
    {
      id: 'act_schedule',
      command: '/schedule',
      title: 'Create Automated Scheduled Agent Run',
      category: 'Actions' as const,
      description: 'Schedule interval or calendar recurring runs.',
      risk: 'low',
      permissions: ['schedule_create'],
      outputFormat: 'Scheduled Task Record',
      icon: Calendar
    },
    // Connectors
    ...connectors.map((c) => ({
      id: c.id,
      command: `/${(c.displayName || c.name || 'connector').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title: `Invoke ${c.displayName || c.name || 'connector'}`,
      category: 'Connectors (MCP)' as const,
      description: c.description || 'Invoke a connected remote tool.',
      risk: 'medium' as const,
      permissions: c.scopes || [],
      outputFormat: 'Remote MCP Output',
      icon: Radio
    }))
  ];

  const filtered = allItems.filter(
    (item) =>
      item.command.toLowerCase().includes(query.toLowerCase()) ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const selectedItem = filtered[selectedIndex] || filtered[0];

  return (
    <div
      id="slash-command-palette"
      className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-96"
    >
      {/* Left List */}
      <div className="w-full md:w-3/5 overflow-y-auto p-2 divide-y divide-stone-100 max-h-60 md:max-h-96 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-xs text-stone-500">
            No matching command for "{query}". Press Escape to dismiss.
          </div>
        ) : (
          filtered.map((item, idx) => {
            const Icon = item.icon;
            const isHighlighted = idx === selectedIndex;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCommand(item.command, item.command + ' ')}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                  isHighlighted
                    ? 'bg-stone-100 text-stone-900 font-medium'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-stone-200/70 flex items-center justify-center text-stone-700 shrink-0">
                    <Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-orange-700 font-semibold">{item.command}</span>
                      <span className="truncate text-stone-800">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">{item.description}</p>
                  </div>
                </div>
                <ArrowRight size={13} className="text-stone-400 shrink-0 ml-2" />
              </button>
            );
          })
        )}
      </div>

      {/* Right: Detailed Permission & Output Preview Drawer */}
      {selectedItem && (
        <div className="hidden md:flex w-2/5 bg-stone-50 border-l border-stone-200 p-3.5 flex-col justify-between text-xs space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                {selectedItem.category}
              </span>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  selectedItem.risk === 'high'
                    ? 'bg-red-100 text-red-700'
                    : selectedItem.risk === 'medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {selectedItem.risk} Risk
              </span>
            </div>

            <h4 className="font-semibold text-stone-900">{selectedItem.title}</h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="pt-2 border-t border-stone-200/80 space-y-1.5 text-[11px]">
              <div className="text-stone-500 font-medium">Required Scopes:</div>
              <div className="flex flex-wrap gap-1">
                {selectedItem.permissions.map((perm, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 bg-white border border-stone-200 rounded font-mono text-[10px] text-stone-600"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1 text-[11px]">
              <span className="text-stone-500 font-medium">Expected Output: </span>
              <span className="text-stone-800">{selectedItem.outputFormat}</span>
            </div>
          </div>

          <div className="text-[10px] text-stone-400 font-mono flex items-center justify-between">
            <span>Enter to insert</span>
            <span>Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
