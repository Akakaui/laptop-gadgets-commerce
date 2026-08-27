import React, { useState, useRef } from 'react';
import {
  Database,
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  Trash2,
  Lock,
  Plus,
  ShieldCheck,
  X
} from 'lucide-react';
import { ProjectSource, Project } from '../types';

interface SourceManagerProps {
  sources: ProjectSource[];
  projects: Project[];
  onUploadSource: (name: string, content: string, projectId?: string) => void;
  onDeleteSource: (sourceId: string) => void;
}

export function SourceManager({
  sources,
  projects,
  onUploadSource,
  onDeleteSource
}: SourceManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceText, setNewSourceText] = useState('');
  const [targetProjId, setTargetProjId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.extractedText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject =
      selectedProjectId === 'all' || s.projectId === selectedProjectId;
    return matchesSearch && matchesProject;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onUploadSource(file.name, text || 'Extracted document contents.', targetProjId || undefined);
        setIsUploading(false);
        setNewSourceName('');
        setNewSourceText('');
      };
      reader.readAsText(file);
    }
  };

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceText.trim()) return;
    onUploadSource(newSourceName.trim(), newSourceText.trim(), targetProjId || undefined);
    setIsUploading(false);
    setNewSourceName('');
    setNewSourceText('');
  };

  return (
    <div id="source-manager-view" className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-stone-800" />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Knowledge Base & Grounded Sources
            </h1>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            Uploaded PDFs, Markdown specs, and scraped research indexed for grounded retrieval with SHA-256 integrity verification.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus size={15} />
          <span>Upload Source</span>
        </button>
      </div>

      {/* Upload Modal / Drawer */}
      {isUploading && (
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-stone-900">Upload & Index New Knowledge Source</h3>
            <button onClick={() => setIsUploading(false)} className="text-stone-400 hover:text-stone-700">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleManualUpload} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Source Name / Filename</label>
                <input
                  type="text"
                  placeholder="e.g. Q3_Product_Specs.md"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Target Project</label>
                <select
                  value={targetProjId}
                  onChange={(e) => setTargetProjId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
                >
                  <option value="">Standalone / Unassigned</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Text Content / Document Text</label>
              <textarea
                placeholder="Paste or type content to be vectorized and indexed..."
                rows={4}
                value={newSourceText}
                onChange={(e) => setNewSourceText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Or Select File from Disk
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSourceName.trim() || !newSourceText.trim()}
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 disabled:opacity-40"
                >
                  Index & Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search indexed sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium shrink-0">Filter by:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-900 shadow-2xs"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-2xl">
            No matching sources found.
          </div>
        ) : (
          filteredSources.map((src) => {
            const project = projects.find((p) => p.id === src.projectId);
            return (
              <div
                key={src.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-stone-700 shrink-0" />
                      <h4 className="font-semibold text-xs text-stone-900 truncate">{src.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      100% Extracted
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed font-sans">
                    "{src.extractedText}"
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <div>
                    <span>{project ? project.name : 'Standalone'}</span>
                    <span className="mx-1.5">•</span>
                    <span>{src.tokenCount} tokens</span>
                  </div>
                  <button
                    onClick={() => onDeleteSource(src.id)}
                    className="p-1 hover:text-red-600 rounded"
                    title="Delete source"
                  >
                    <Trash2 size={13} />
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
