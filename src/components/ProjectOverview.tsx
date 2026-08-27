import { useState } from 'react';
import {
  Folder,
  Lock,
  Globe,
  BrainCircuit,
  Plus,
  FileText,
  Layers,
  MessageSquare,
  Users,
  Settings,
  Edit2,
  Trash2,
  Check,
  Save
} from 'lucide-react';
import { Project, ProjectSource, Artifact, Conversation, MemoryMode } from '../types';

interface ProjectOverviewProps {
  project: Project;
  sources: ProjectSource[];
  artifacts: Artifact[];
  conversations: Conversation[];
  onUpdateProject: (updated: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectConversation: (convId: string) => void;
  onOpenArtifact: (artifactId: string) => void;
  onUploadSource: () => void;
  onNewChatInProject: () => void;
}

export function ProjectOverview({
  project,
  sources,
  artifacts,
  conversations,
  onUpdateProject,
  onDeleteProject,
  onSelectConversation,
  onOpenArtifact,
  onUploadSource,
  onNewChatInProject
}: ProjectOverviewProps) {
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [instructionsText, setInstructionsText] = useState(project.instructions);

  const handleSaveInstructions = () => {
    onUpdateProject({ ...project, instructions: instructionsText });
    setIsEditingInstructions(false);
  };

  const handleMemoryModeChange = (mode: MemoryMode) => {
    onUpdateProject({ ...project, memoryMode: mode });
  };

  return (
    <div id="project-overview-view" className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Project Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-orange-700 shrink-0" />
            <h1 className="text-xl font-bold tracking-tight text-stone-900 truncate">
              {project.name}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase">
              {project.status}
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNewChatInProject}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus size={15} />
            <span>New Chat in Project</span>
          </button>
        </div>
      </div>

      {/* Grid: Context & Memory Mode + Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Memory Boundary Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Memory Boundary
            </h3>
            <span className="text-[10px] font-mono text-orange-700 font-semibold uppercase">
              {project.memoryMode}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Project-only isolation strictly prevents cross-talk with unrelated chats or external memories.
          </p>

          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => handleMemoryModeChange('project_only')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                project.memoryMode === 'project_only'
                  ? 'bg-orange-50 text-orange-950 font-medium border border-orange-200'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock size={13} className="text-orange-700" />
                <span>Project-Only</span>
              </div>
              {project.memoryMode === 'project_only' && <Check size={13} className="text-orange-700" />}
            </button>

            <button
              onClick={() => handleMemoryModeChange('global')}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                project.memoryMode === 'global'
                  ? 'bg-emerald-50 text-emerald-950 font-medium border border-emerald-200'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe size={13} className="text-emerald-700" />
                <span>Allow Global</span>
              </div>
              {project.memoryMode === 'global' && <Check size={13} className="text-emerald-700" />}
            </button>
          </div>
        </div>

        {/* Right 2 cols: Project Instructions */}
        <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Project System Instructions
              </h3>
              {!isEditingInstructions && (
                <button
                  onClick={() => setIsEditingInstructions(true)}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingInstructions ? (
              <textarea
                value={instructionsText}
                onChange={(e) => setInstructionsText(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
              />
            ) : (
              <p className="text-xs text-stone-700 leading-relaxed font-sans italic bg-stone-50 p-3 rounded-xl border border-stone-100">
                "{project.instructions || 'No custom instructions defined yet.'}"
              </p>
            )}
          </div>

          {isEditingInstructions && (
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingInstructions(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-orange-700"
              >
                Save Instructions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Sources & Artifacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Sources */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-stone-700" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Knowledge Sources ({sources.length})
              </h3>
            </div>
            <button
              onClick={onUploadSource}
              className="text-xs text-orange-700 font-semibold hover:text-orange-900 flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Upload</span>
            </button>
          </div>

          <div className="space-y-2">
            {sources.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">No sources attached yet.</p>
            ) : (
              sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3 bg-stone-50 border border-stone-200/70 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={14} className="text-stone-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900 truncate">{src.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {src.tokenCount} tokens • {src.extractionQuality} quality
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold uppercase">
                    Indexed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project Artifacts */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-stone-700" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Durable Artifacts ({artifacts.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {artifacts.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">No artifacts synthesized yet.</p>
            ) : (
              artifacts.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onOpenArtifact(art.id)}
                  className="p-3 bg-stone-50 hover:bg-orange-50/50 border border-stone-200/70 hover:border-orange-200 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Layers size={14} className="text-orange-700 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900 truncate">{art.title}</p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {art.type.toUpperCase()} • v{art.currentVersion}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">
                    {new Date(art.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
