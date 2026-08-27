import React from 'react';
import { ArrowLeft, Bot, CheckCircle2, Clock3, FileText, Layers, LockKeyhole, X } from 'lucide-react';
import { SubagentTask } from '../types';

interface DelegationInspectorProps {
  task: SubagentTask | null;
  onClose: () => void;
  onPromoteToArtifact?: (task: SubagentTask) => void;
}

export function DelegationInspector({ task, onClose, onPromoteToArtifact }: DelegationInspectorProps) {
  if (!task) return null;
  const activity = task.activity || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[2px]" onClick={onClose}>
      <aside className="flex h-full w-full max-w-[560px] flex-col border-l border-white/10 bg-[#141312] text-stone-100 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-stone-500 hover:bg-white/[0.06] hover:text-stone-100" title="Close nested session"><ArrowLeft size={16} /></button>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-400/12 text-orange-300"><Bot size={16} /></div>
            <div className="min-w-0"><p className="truncate text-sm font-medium">{task.role.replace('_', ' ')} subagent</p><p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-stone-600">Nested read-only session</p></div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-stone-600 hover:bg-white/[0.06] hover:text-stone-100" title="Close"><X size={16} /></button>
        </header>

        <div className="border-b border-white/8 bg-[#171615] px-5 py-3 text-[11px] text-stone-500"><span className="text-stone-300">Primary agent delegated:</span> {task.goal}<div className="mt-2 flex flex-wrap gap-2"><span className="rounded-full border border-white/10 px-2 py-1">{task.status}</span><span className="rounded-full border border-white/10 px-2 py-1">{task.tokensUsed}/{task.tokenBudget} tokens</span><span className="rounded-full border border-white/10 px-2 py-1">{Math.round(task.confidence * 100)}% confidence</span></div></div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-6">
            <div className="flex gap-3"><div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-stone-400"><LockKeyhole size={13} /></div><div className="max-w-[420px] rounded-2xl rounded-tl-md bg-white/[0.05] px-4 py-3 text-[13px] leading-6 text-stone-300"><p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-stone-600">Delegation brief</p>{task.goal}<p className="mt-2 text-[11px] text-stone-600">The parent orchestrator owns this session. You can inspect progress and output, but messages are routed through the parent.</p></div></div>
            <div className="space-y-2 border-l border-white/10 pl-5">{activity.length === 0 ? <p className="text-xs text-stone-600">No nested activity has been emitted yet.</p> : activity.map((event) => <div key={event.id} className="flex gap-3 text-[12px] leading-5 text-stone-400"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-300/70" /><div><p className="text-stone-300">{event.title}</p>{event.detail && <p className="text-stone-600">{event.detail}</p>}</div></div>)}</div>
            {task.outputPayload && <div className="flex gap-3"><div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckCircle2 size={14} /></div><div className="max-w-[450px] rounded-2xl rounded-tl-md border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-3 text-[13px] leading-6 text-stone-300"><p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-emerald-300/70">Subagent output</p><pre className="whitespace-pre-wrap font-sans text-[12px]">{JSON.stringify(task.outputPayload, null, 2)}</pre></div></div>}
            {task.citations && task.citations.length > 0 && <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3"><div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-stone-600"><FileText size={12} /> Source provenance</div><div className="space-y-1 text-[11px] text-stone-500">{task.citations.map((citation, index) => <p key={index} className="truncate">{typeof citation === 'string' ? citation : citation.title || citation.url || 'Verified source'}</p>)}</div></div>}
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-white/10 px-5 py-4"><span className="flex items-center gap-2 text-[11px] text-stone-600"><Clock3 size={13} /> Inspection only · no direct subagent messaging</span>{onPromoteToArtifact && <button type="button" onClick={() => onPromoteToArtifact(task)} className="flex items-center gap-2 rounded-xl bg-orange-400 px-3 py-2 text-xs font-semibold text-[#20110b]"><Layers size={13} /> Promote output</button>}</footer>
      </aside>
    </div>
  );
}
