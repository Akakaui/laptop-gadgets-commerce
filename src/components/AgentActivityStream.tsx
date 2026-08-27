import React, { useMemo } from 'react';
import { Activity, Bot, BrainCircuit, CheckCircle2, ChevronDown, CircleDot, Database, FileText, Globe2, LockKeyhole, Network, Search, ShieldCheck, Wrench, XCircle } from 'lucide-react';
import { AgentActivityEvent, SubagentTask } from '../types';

interface AgentActivityStreamProps {
  events?: AgentActivityEvent[];
  subagents?: SubagentTask[];
  onInspectSubagent?: (task: SubagentTask) => void;
}

const eventIcon = (event: AgentActivityEvent) => {
  if (event.type === 'thought') return BrainCircuit;
  if (event.type === 'tool_call') return Search;
  if (event.type === 'mcp_call') return Network;
  if (event.type === 'context_read') return Database;
  if (event.type === 'subagent') return Bot;
  if (event.type === 'file') return FileText;
  if (event.type === 'approval') return ShieldCheck;
  if (event.type === 'artifact') return Wrench;
  return Activity;
};

const statusIcon = (status: AgentActivityEvent['status']) => {
  if (status === 'completed') return CheckCircle2;
  if (status === 'failed' || status === 'blocked') return XCircle;
  if (status === 'running') return CircleDot;
  return LockKeyhole;
};

export function AgentActivityStream({ events = [], subagents = [], onInspectSubagent }: AgentActivityStreamProps) {
  const visibleEvents = useMemo(() => events.slice(-12), [events]);
  if (visibleEvents.length === 0 && subagents.length === 0) return null;

  return (
    <details className="group overflow-hidden rounded-2xl border border-white/10 bg-[#171615]" open={visibleEvents.some((event) => event.status === 'running')}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-stone-300">
        <div className="flex min-w-0 items-center gap-2">
          <Activity size={14} className="text-orange-300" />
          <span className="text-xs font-medium">Task activity</span>
          <span className="text-[10px] text-stone-600">{visibleEvents.length + subagents.length} events</span>
        </div>
        <ChevronDown size={14} className="text-stone-600 transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-white/8 px-3.5 pb-3.5">
        <div className="relative space-y-1.5 pt-3">
          <div className="absolute bottom-2 left-[7px] top-3 w-px bg-white/10" />
          {visibleEvents.map((event) => {
            const Icon = eventIcon(event);
            const Status = statusIcon(event.status);
            return (
              <div key={event.id} className="relative flex items-start gap-2.5 rounded-xl px-1 py-1.5 hover:bg-white/[0.035]">
                <div className="relative z-10 mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#171615] text-stone-500">
                  <Icon size={12} className={event.status === 'running' ? 'text-orange-300' : 'text-stone-500'} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[11px] font-medium text-stone-300">{event.title}</span>
                    {event.type === 'mcp_call' && <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-cyan-300">MCP</span>}
                    {event.type === 'thought' && <span className="rounded bg-violet-400/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-violet-300">Summary</span>}
                    <Status size={11} className={event.status === 'completed' ? 'text-emerald-400' : event.status === 'failed' ? 'text-red-400' : event.status === 'running' ? 'text-orange-300' : 'text-stone-600'} />
                  </div>
                  {event.detail && <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-stone-600">{event.detail}</p>}
                  {(event.toolName || event.connectorName || event.scope) && <div className="mt-1 flex flex-wrap gap-1.5 text-[9px] text-stone-600"><span>{event.toolName || event.connectorName}</span>{event.scope && <span>· {event.scope}</span>}</div>}
                </div>
              </div>
            );
          })}
          {subagents.map((task) => (
            <button key={task.taskId} type="button" onClick={() => onInspectSubagent?.(task)} className="relative flex w-full items-start gap-2.5 rounded-xl px-1 py-1.5 text-left hover:bg-white/[0.05]">
              <div className="relative z-10 mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#171615] text-orange-300"><Bot size={12} /></div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="truncate text-[11px] font-medium text-stone-300">{task.role.replace('_', ' ')} subagent</span><span className="text-[9px] uppercase tracking-wider text-stone-600">{task.status}</span></div><p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-stone-600">Open nested read-only session · {task.tokensUsed}/{task.tokenBudget} tokens</p></div>
            </button>
          ))}
        </div>
      </div>
    </details>
  );
}
