import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  RotateCw,
  X
} from 'lucide-react';
import { ScheduledTask, Project } from '../types';

interface ScheduledTaskManagerProps {
  schedules: ScheduledTask[];
  projects: Project[];
  onSaveSchedule: (schedule: ScheduledTask) => void;
  onRunScheduleNow: (scheduleId: string) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}

export function ScheduledTaskManager({
  schedules,
  projects,
  onSaveSchedule,
  onRunScheduleNow,
  onDeleteSchedule
}: ScheduledTaskManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [expression, setExpression] = useState('Every day at 09:00 AM PST');
  const [targetProjId, setTargetProjId] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prompt.trim()) return;

    const newTask: ScheduledTask = {
      id: 'sched_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      prompt: prompt.trim(),
      agentId: 'agent_main_default',
      projectId: targetProjId || undefined,
      scheduleExpression: expression.trim(),
      scheduleType: 'interval',
      status: 'active',
      history: [],
      createdAt: new Date().toISOString()
    };

    onSaveSchedule(newTask);
    setIsCreating(false);
    setName('');
    setPrompt('');
  };

  const toggleStatus = (task: ScheduledTask) => {
    const updatedStatus = task.status === 'active' ? 'paused' : 'active';
    onSaveSchedule({ ...task, status: updatedStatus });
  };

  return (
    <div id="scheduled-tasks-view" className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-stone-800" />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Scheduled Tasks & Automations
            </h1>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            Automate recurring competitor monitors, compliance audits, and daily summaries with human approval checkpoints for high-risk side effects.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus size={15} />
          <span>New Scheduled Task</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-stone-900">Create Scheduled Agent Run</h3>
            <button onClick={() => setIsCreating(false)} className="text-stone-400 hover:text-stone-700">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Task Name</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Market Pulse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Schedule Recurrence</label>
                <input
                  type="text"
                  placeholder="e.g. Every Monday at 8:00 AM PST"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Agent Prompt & Objectives</label>
              <textarea
                placeholder="What should the agent execute during this run?"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
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
                disabled={!name.trim() || !prompt.trim()}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 disabled:opacity-40"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.map((task) => {
          const isActive = task.status === 'active';
          const project = projects.find((p) => p.id === task.projectId);
          return (
            <div
              key={task.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    <h3 className="font-bold text-sm text-stone-900">{task.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase font-semibold">
                      {task.scheduleExpression}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans italic">"{task.prompt}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRunScheduleNow(task.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Play size={12} />
                    <span>Run Now</span>
                  </button>

                  <button
                    onClick={() => onDeleteSchedule(task.id)}
                    className="p-1.5 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete scheduled task"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => toggleStatus(task)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                    title={isActive ? 'Pause' : 'Resume'}
                  >
                    {isActive ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                </div>
              </div>

              {/* Execution Audit History */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  Recent Executions ({task.history.length})
                </div>
                {task.history.length === 0 ? (
                  <p className="text-[11px] text-stone-400">No previous runs recorded.</p>
                ) : (
                  <div className="space-y-1">
                    {task.history.map((run, i) => (
                      <div
                        key={i}
                        className="p-2 bg-stone-50 border border-stone-100 rounded-lg flex items-center justify-between text-xs text-stone-700"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                          <span className="truncate">{run.summary}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0">
                          {new Date(run.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({run.durationMs}ms)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
