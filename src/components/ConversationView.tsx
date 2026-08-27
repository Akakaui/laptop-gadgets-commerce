import { useState } from 'react';
import {
  User,
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  FileText,
  ExternalLink,
  ShieldCheck,
  RotateCw,
  Copy,
  Paperclip,
  Info,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  UploadCloud,
  Check,
  BrainCircuit
} from 'lucide-react';
import {
  Message,
  PlanStep,
  SubagentTask,
  ToolApprovalRequest,
  ToolContinuationPacket,
  Citation,
  Artifact
} from '../types';
import { AgentActivityStream } from './AgentActivityStream';
import { InlineArtifactCard } from './InlineArtifactCard';

interface ConversationViewProps {
  messages: Message[];
  artifacts: Artifact[];
  isRunning: boolean;
  onPromptRevision: (prompt: string, artifact: Artifact) => void;
  onSaveToProjectSources: (artifact: Artifact) => void;
  onSaveVersion: (artifactId: string, content: string, summary: string) => void;
  onApproveTool: (approvalId: string) => void;
  onRejectTool: (approvalId: string, reason?: string) => void;
  onResumeBlockedRun: (packetId: string, uploadedFile?: File) => void;
  onAnswerQuestion?: (messageId: string, answer: string | string[] | Record<string, string | string[]>) => void;
  onInspectSubagent?: (task: SubagentTask) => void;
  onSelectCitation?: (citation: Citation) => void;
}

export function ConversationView({
  messages,
  artifacts,
  isRunning,
  onPromptRevision,
  onSaveToProjectSources,
  onSaveVersion,
  onApproveTool,
  onRejectTool,
  onResumeBlockedRun,
  onAnswerQuestion,
  onInspectSubagent,
  onSelectCitation
}: ConversationViewProps) {
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingApprovalId, setRejectingApprovalId] = useState<string | null>(null);

  const handleCopy = (msg: Message) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div id="conversation-stream" className="flex-1 overflow-y-auto px-4 pb-36 pt-6 md:px-8 md:pb-40 md:pt-10 space-y-8 max-w-3xl mx-auto w-full">
      {messages.length === 0 ? (
        <div id="conversation-empty-state" className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400 space-y-5 my-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-400/50 bg-orange-400/10 text-orange-300 text-lg font-semibold">L</div>
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-stone-100">How can I help you today?</h1>
            <p className="text-sm leading-6 text-stone-500">Ask a question, attach a file, or describe a goal. I will stay direct for simple requests and show useful activity when research, tools, or a durable artifact are needed.</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              id={`message-${msg.id}`}
              className={`flex gap-3 md:gap-5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-400/40 bg-orange-400/10 text-orange-300 text-[11px] font-semibold">L</div>
              )}

              {/* Message Box */}
              <div
                className={`max-w-[680px] w-full space-y-3 text-[13px] md:text-[14px] leading-7 transition-all ${
                  isUser
                    ? 'rounded-2xl bg-[#242321] px-4 py-3 text-stone-100 shadow-sm'
                    : 'text-stone-200'
                }`}
              >
                {/* User Content */}
                {isUser && (
                  <div className="space-y-2">
                    <p className="whitespace-pre-wrap font-normal text-stone-100">{msg.content}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.attachments.map((att, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-stone-800 border border-stone-700 rounded text-[11px] text-stone-300 font-mono"
                          >
                            <Paperclip size={12} /> {att.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Assistant Content & Structured Turn Renderers */}
                {!isUser && (
                  <div className="space-y-4">
                    {msg.turnType && msg.turnType !== 'completion_summary' && (
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-orange-300/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <span>{msg.turnType.replaceAll('_', ' ')}</span>
                      </div>
                    )}
                    {msg.content && msg.turnType === 'completion_summary' && (
                      <div className="flex justify-end pb-1">
                        <button onClick={() => handleCopy(msg)} className="text-stone-500 hover:text-stone-200 p-1.5 rounded-lg" title="Copy response">
                          {copiedMsgId === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}

                    {/* Main Narrative Text */}
                    {msg.content && (
                      <div className="prose prose-invert prose-sm max-w-none text-stone-200 leading-7 whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    )}

                    <AgentActivityStream events={msg.activity} subagents={msg.subagents} onInspectSubagent={onInspectSubagent} />

                    {msg.questions && msg.questions.length > 1 && msg.questions.some((question) => question.status === 'pending') ? (
                      <QuestionSetCard questions={msg.questions.filter((question) => question.status === 'pending' || question.answer !== undefined)} onAnswer={(answer) => onAnswerQuestion?.(msg.id, answer)} />
                    ) : msg.question && msg.question.status === 'pending' ? (
                      <QuestionCard question={msg.question} onAnswer={(answer) => onAnswerQuestion?.(msg.id, answer)} />
                    ) : null}

                    {/* Plan Card */}
                    {msg.plan && (
                      <details className="group rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 space-y-3">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-stone-300">
                          <div className="flex items-center gap-2">
                            <Layers size={15} className="text-orange-300" />
                            <span className="text-xs font-medium">Execution details</span>
                            <span className="text-[11px] text-stone-500">{msg.plan.steps.filter((step) => step.status === 'completed').length}/{msg.plan.steps.length} steps</span>
                          </div>
                          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                            {msg.plan.delegationMode}
                          </span>
                        </summary>

                        <div className="space-y-2">
                          {msg.plan.steps.map((step, idx) => (
                            <div
                              key={step.stepId}
                              className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
                                step.status === 'completed'
                                  ? 'bg-white border-stone-200 text-stone-800'
                                  : step.status === 'running'
                                  ? 'bg-orange-50/70 border-orange-200 text-orange-950 font-medium'
                                  : step.status === 'blocked'
                                  ? 'bg-red-50 border-red-200 text-red-900'
                                  : 'bg-stone-100/50 border-stone-200 text-stone-500'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {step.status === 'completed' ? (
                                  <CheckCircle2 size={14} className="text-emerald-700" />
                                ) : step.status === 'running' ? (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-orange-700 border-t-transparent animate-spin" />
                                ) : step.status === 'blocked' ? (
                                  <AlertTriangle size={14} className="text-red-700" />
                                ) : (
                                  <Clock size={14} className="text-stone-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    Step {idx + 1}: {step.objective}
                                  </span>
                                  <span className="text-[10px] font-mono text-stone-500 uppercase ml-2">
                                    {step.assignedRole.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    {/* Subagents Delegation Badges */}
                    {msg.subagents && msg.subagents.length > 0 && (
                      <details className="group rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 space-y-2.5">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-stone-300">
                          <span>Specialists working</span>
                          <span className="text-[10px] font-mono text-stone-500">
                            {msg.subagents.filter((s) => s.status === 'completed').length}/{msg.subagents.length}
                          </span>
                        </summary>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.subagents.map((sub) => (
                            <div
                              key={sub.taskId}
                              onClick={() => onInspectSubagent && onInspectSubagent(sub)}
                              className="p-2.5 bg-white border border-stone-200 rounded-lg text-xs space-y-1.5 hover:border-stone-400 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-stone-900 capitalize">
                                  {sub.role.replace('_', ' ')}
                                </span>
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                    sub.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : sub.status === 'running'
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-stone-200 text-stone-700'
                                  }`}
                                >
                                  {sub.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 truncate">{sub.goal}</p>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                                <span>{sub.tokensUsed} tokens</span>
                                <span>Conf: {(sub.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    {/* Tool Approval Card */}
                    {msg.approvalRequest && msg.approvalRequest.status === 'pending' && (
                      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-3 shadow-sm">
                        <div className="flex items-start gap-2.5">
                          <ShieldAlert size={20} className="text-amber-800 shrink-0 mt-0.5" />
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                                Consequential Tool Approval Required
                              </h4>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white uppercase">
                                {msg.approvalRequest.risk} Risk
                              </span>
                            </div>
                            <p className="text-xs text-amber-900 leading-relaxed font-medium">
                              {msg.approvalRequest.summary}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white/80 border border-amber-200 rounded-lg p-2.5 text-[11px] font-mono space-y-1 text-stone-700">
                          <div><strong className="text-stone-900">Destination:</strong> {msg.approvalRequest.destinationSystem}</div>
                          <div><strong className="text-stone-900">Tool:</strong> {msg.approvalRequest.toolName}</div>
                          <div><strong className="text-stone-900">Connector:</strong> {msg.approvalRequest.connectorName}</div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onApproveTool(msg.approvalRequest!.id)}
                            className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                          >
                            Approve & Execute
                          </button>
                          <button
                            onClick={() => setRejectingApprovalId(msg.approvalRequest!.id)}
                            className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Blocked Run Continuation Packet (`TOOL-REQ`) */}
                    {msg.continuationPacket && (
                      <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
                                {msg.continuationPacket.reqId}
                              </span>
                              <h4 className="font-semibold text-xs text-red-950">
                                {msg.continuationPacket.title}
                              </h4>
                            </div>
                            <p className="text-xs text-red-900 leading-relaxed">
                              {msg.continuationPacket.reason}
                            </p>
                          </div>
                        </div>

                        {msg.continuationPacket.manualUploadSpec && (
                          <div className="bg-white border border-red-200/80 rounded-lg p-3 text-xs space-y-2">
                            <div className="font-semibold text-stone-900">Upload Specification:</div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                              <div><strong>File:</strong> {msg.continuationPacket.manualUploadSpec.filename}</div>
                              <div><strong>Dimensions:</strong> {msg.continuationPacket.manualUploadSpec.dimensions}</div>
                            </div>
                            <button
                              onClick={() => onResumeBlockedRun(msg.continuationPacket!.reqId)}
                              className="w-full mt-2 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <UploadCloud size={14} />
                              <span>Upload Asset & Resume Run</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Grounded Citations Bar */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-stone-100 space-y-1.5">
                        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                          Grounded Citations ({msg.citations.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((cit) => (
                            <button
                              key={cit.id}
                              onClick={() => {
                                setActiveCitation(cit);
                                if (onSelectCitation) onSelectCitation(cit);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-xs text-stone-700 transition-colors"
                              title={cit.snippet}
                            >
                              <FileText size={12} className="text-stone-500" />
                              <span className="truncate max-w-[160px] font-medium">{cit.title}</span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {(cit.relevanceScore * 100).toFixed(0)}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inline generated work products */}
                    {msg.artifactIds && msg.artifactIds.length > 0 && (
                      <div className="space-y-3 pt-1">
                        {msg.artifactIds.map((artId) => {
                          const artifact = artifacts.find((item) => item.id === artId);
                          return artifact ? <div key={artId}><InlineArtifactCard artifact={artifact} onPromptRevision={onPromptRevision} onSaveToProjectSources={onSaveToProjectSources} onSaveVersion={onSaveVersion} /></div> : null;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-700 text-stone-200"><User size={14} /></div>
              )}
            </div>
          );
        })
      )}

      {/* Active Citation Modal Drawer */}
      {activeCitation && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setActiveCitation(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-5 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-700 font-semibold">
                Verified Source Provenance
              </span>
              <span className="text-xs font-mono text-stone-500">
                Score: {(activeCitation.relevanceScore * 100).toFixed(0)}%
              </span>
            </div>
            <h4 className="text-sm font-semibold text-stone-900">{activeCitation.title}</h4>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 leading-relaxed italic">
              "{activeCitation.snippet}"
            </div>
            <button
              onClick={() => setActiveCitation(null)}
              className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-medium"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function QuestionCard({ question, onAnswer }: { question: import('../types').AgentQuestion; onAnswer: (answer: string | string[]) => void }) {
  const [customAnswer, setCustomAnswer] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const hasOptions = Boolean(question.options?.length);

  const submit = (value?: string) => {
    const answer = value ?? (question.allowMultiple ? selected : customAnswer.trim());
    if (Array.isArray(answer) ? answer.length : answer) onAnswer(answer);
  };

  return (
    <div className="question-card rounded-2xl border border-orange-300/35 bg-[#25211e] p-4 text-stone-100 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-300 bg-white text-orange-700 text-xs font-semibold">?</div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">{question.header || 'Your input is needed'}</p>
            <p className="mt-1 text-sm leading-6 text-stone-800">{question.prompt}</p>
          </div>
          {hasOptions && (
            <div className="grid gap-2 sm:grid-cols-2">
              {question.options?.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => question.allowMultiple ? setSelected(isSelected ? selected.filter((v) => v !== option.value) : [...selected, option.value]) : submit(option.value)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${isSelected ? 'border-orange-400 bg-orange-400/15' : 'border-white/10 bg-[#171615] hover:border-orange-300/60 hover:bg-white/[0.06]'}`}
                  >
                    <span className="block text-xs font-semibold">{option.label}</span>
                    {option.description && <span className="mt-1 block text-[11px] leading-4 text-stone-500">{option.description}</span>}
                  </button>
                );
              })}
            </div>
          )}
          {question.allowMultiple && selected.length > 0 && <button type="button" onClick={() => submit()} className="rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white">Continue</button>}
          {!hasOptions && (
            <div className="flex gap-2">
              <input value={customAnswer} onChange={(event) => setCustomAnswer(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && submit()} placeholder="Type your answer" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#171615] px-3 py-2 text-sm outline-none focus:border-orange-500" />
              <button type="button" onClick={() => submit()} className="rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white">Answer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function QuestionSetCard({ questions, onAnswer }: { questions: import('../types').AgentQuestion[]; onAnswer: (answer: Record<string, string | string[]>) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const current = questions[index];
  const currentAnswer = answers[current.id];
  const choose = (value: string | string[]) => setAnswers((previous) => ({ ...previous, [current.id]: value }));
  const canAdvance = currentAnswer !== undefined && (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : Boolean(currentAnswer));

  return (
    <div className="question-card rounded-2xl border border-orange-300/35 bg-[#25211e] p-4 text-stone-100 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-300/50 bg-orange-400/10 text-orange-300 text-xs">?</div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">{current.header || 'Your input is needed'}</p>
            <p className="mt-1 text-[11px] text-stone-500">Decision {index + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {questions.map((question, questionIndex) => <span key={question.id} className={`h-1.5 w-5 rounded-full ${questionIndex === index ? 'bg-orange-400' : answers[question.id] ? 'bg-emerald-400/70' : 'bg-white/10'}`} />)}
        </div>
      </div>
      <p className="mb-4 text-sm leading-6 text-stone-200">{current.prompt}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {current.options?.map((option) => {
          const selected = Array.isArray(currentAnswer) ? currentAnswer.includes(option.value) : currentAnswer === option.value;
          return <button key={option.id} type="button" onClick={() => current.allowMultiple ? choose(selected ? (currentAnswer as string[]).filter((value) => value !== option.value) : [...((currentAnswer as string[]) || []), option.value]) : choose(option.value)} className={`rounded-xl border px-3 py-3 text-left transition ${selected ? 'border-orange-400 bg-orange-400/15' : 'border-white/10 bg-[#171615] hover:border-orange-300/60 hover:bg-white/[0.06]'}`}><span className="block text-xs font-semibold text-stone-100">{option.label}</span>{option.description && <span className="mt-1 block text-[11px] leading-4 text-stone-500">{option.description}</span>}</button>;
        })}
      </div>
      {current.allowCustomAnswer && <input value={typeof currentAnswer === 'string' && !current.options?.some((option) => option.value === currentAnswer) ? currentAnswer : ''} onChange={(event) => choose(event.target.value)} placeholder="Or type your own answer" className="mt-3 w-full rounded-xl border border-white/10 bg-[#171615] px-3 py-2 text-sm outline-none focus:border-orange-400" />}
      <div className="mt-4 flex justify-between gap-2">
        <button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} className="rounded-lg px-3 py-2 text-xs text-stone-500 disabled:opacity-30">Back</button>
        {index < questions.length - 1 ? <button type="button" onClick={() => canAdvance && setIndex((value) => value + 1)} disabled={!canAdvance} className="rounded-lg bg-orange-400 px-4 py-2 text-xs font-semibold text-[#1d110b] disabled:opacity-40">Next</button> : <button type="button" onClick={() => canAdvance && onAnswer(answers)} disabled={!canAdvance} className="rounded-lg bg-orange-400 px-4 py-2 text-xs font-semibold text-[#1d110b] disabled:opacity-40">Continue</button>}
      </div>
    </div>
  );
}
