import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Paperclip,
  Mic,
  X,
  FileText,
  Image as ImageIcon,
  StopCircle,
  HelpCircle
} from 'lucide-react';
import { SlashCommandPalette } from './SlashCommandPalette';
import { SkillDefinition, AgentDefinition, RemoteMcpConnector, ProjectSource, AgentMode } from '../types';

interface ComposerProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isRunning: boolean;
  onCancelRun: () => void;
  skills: SkillDefinition[];
  agents: AgentDefinition[];
  connectors: RemoteMcpConnector[];
  projectSources?: ProjectSource[];
  mode: AgentMode;
  onModeChange: (mode: AgentMode) => void;
}

export function Composer({
  onSendMessage,
  isRunning,
  onCancelRun,
  skills,
  agents,
  connectors,
  projectSources,
  mode,
  onModeChange
}: ComposerProps) {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showSlashPalette, setShowSlashPalette] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (showSlashPalette) return;
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setShowSlashPalette(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    // Detect slash command trigger at cursor
    const lastWord = val.split(/\s+/).pop() || '';
    if (lastWord.startsWith('/')) {
      setShowSlashPalette(true);
      setSlashQuery(lastWord.slice(1));
    } else {
      setShowSlashPalette(false);
    }
  };

  const handleSelectCommand = (command: string, templateText?: string) => {
    setText((prev) => {
      const parts = prev.split(/\s+/);
      parts.pop();
      return (parts.length > 0 ? parts.join(' ') + ' ' : '') + (templateText || command) + ' ';
    });
    setShowSlashPalette(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if ((!text.trim() && attachedFiles.length === 0) || isRunning) return;
    onSendMessage(text.trim(), attachedFiles);
    setText('');
    setAttachedFiles([]);
    setShowSlashPalette(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const quickPrompts = [
    { label: 'Research a topic', prompt: 'Research a topic and cite the most useful sources.' },
    { label: 'Draft a document', prompt: 'Draft a clear document from my instructions.' },
    { label: 'Create a diagram', prompt: '/diagram Create a simple process diagram.' },
    { label: 'Analyze a file', prompt: 'Analyze the file I attach and summarize the key decisions.' }
  ];

  return (
    <div id="composer-container" className="relative p-3 md:p-4 bg-transparent max-w-3xl mx-auto w-full">
      {/* Floating Slash Command Palette */}
      <SlashCommandPalette
        isOpen={showSlashPalette}
        query={slashQuery}
        onSelectCommand={handleSelectCommand}
        onClose={() => setShowSlashPalette(false)}
        skills={skills}
        agents={agents}
        connectors={connectors}
      />

      {/* Main Composer Box */}
      <div className="relative rounded-2xl border border-white/12 bg-[#1b1a18] p-3.5 shadow-[0_18px_60px_rgba(0,0,0,.34)] transition-all focus-within:border-orange-400/60 focus-within:ring-4 focus-within:ring-orange-400/10 space-y-2">
        {/* Attachment Previews */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 pb-2 border-b border-stone-100">
            {attachedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-700"
              >
                <FileText size={13} className="text-stone-500" />
                <span className="truncate max-w-[140px] font-medium">{file.name}</span>
                <span className="text-[10px] text-stone-400">({(file.size / 1024).toFixed(0)} KB)</span>
                <button
                  onClick={() => removeFile(i)}
                  className="p-0.5 hover:text-red-600 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input */}
        <textarea
          id="composer-input"
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Message your assistant or type '/' for skills, agents, tools, and connectors..."
          rows={1}
          disabled={isRunning}
          className="w-full bg-transparent text-[14px] leading-6 text-stone-100 placeholder:text-stone-500 focus:outline-none resize-none min-h-[56px] max-h-[220px]"
        />

        {/* Bottom Bar: Action Buttons & Run Controls */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <button
              id="attach-file-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-100 hover:bg-white/[0.08] transition-colors"
              title="Attach files (PDF, Markdown, Specs, Images)"
            >
              <Paperclip size={16} />
            </button>

            {/* Quick Slash Palette Trigger */}
            <button
              id="slash-trigger-btn"
              type="button"
              onClick={() => {
                setShowSlashPalette(!showSlashPalette);
                setSlashQuery('');
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-stone-500 hover:text-stone-100 hover:bg-white/[0.08] transition-colors font-mono text-xs"
              title="Browse / commands"
            >
              <span className="font-semibold">/</span>
            </button>

            {/* Simulated Voice Input */}
            <button
              id="voice-toggle-btn"
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-1.5 rounded-lg transition-colors ${
                isRecording ? 'bg-red-400/15 text-red-300 animate-pulse' : 'text-stone-500 hover:text-stone-100 hover:bg-white/[0.08]'
              }`}
              title={isRecording ? 'Listening...' : 'Voice Dictation'}
            >
              <Mic size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[10px] text-stone-400" title="Choose whether the primary agent should only draft a plan or execute safe actions">
              <span className={mode === 'plan' ? 'text-orange-300' : 'text-emerald-300'}>{mode === 'plan' ? 'Plan' : 'Act'}</span>
              <select value={mode} onChange={(event) => onModeChange(event.target.value as AgentMode)} className="bg-transparent text-[10px] text-stone-300 outline-none"><option value="act">Act</option><option value="plan">Plan</option></select>
            </label>
            <span className="text-[11px] text-stone-600 hidden sm:inline">
              Enter to send · Shift + Enter for a new line
            </span>

            {isRunning ? (
              <button
                id="cancel-run-btn"
                onClick={onCancelRun}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-xs transition-colors shadow-xs"
              >
                <StopCircle size={14} />
                <span>Cancel Run</span>
              </button>
            ) : (
              <button
                id="send-message-btn"
                onClick={handleSubmit}
                disabled={!text.trim() && attachedFiles.length === 0}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-400 hover:bg-orange-300 disabled:opacity-25 disabled:hover:bg-orange-400 text-[#20110b] transition-colors shadow-sm"
                title="Send Prompt"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      {!text && !isRunning && (
        <div className="flex flex-wrap gap-1.5 pt-2 justify-center">
          {quickPrompts.map((item, i) => (
            <button
              key={i}
              onClick={() => setText(item.prompt)}
              className="text-[11px] font-medium text-stone-400 bg-white/[0.025] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-full px-3 py-1.5 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
