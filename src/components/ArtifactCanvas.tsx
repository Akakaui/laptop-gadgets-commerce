import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Copy,
  Download,
  Share2,
  History,
  Code2,
  Eye,
  Check,
  RotateCw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  AlertCircle,
  FileDown,
  Save,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import mermaid from 'mermaid';
import { Artifact, ArtifactVersion } from '../types';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
});

interface ArtifactCanvasProps {
  artifact?: Artifact;
  onClose: () => void;
  onSaveVersion: (artifactId: string, newContent: string, changeSummary: string) => void;
  onPromptRevision: (prompt: string, artifact: Artifact) => void;
  onSaveToProjectSources: (artifact: Artifact) => void;
}

export function ArtifactCanvas({
  artifact,
  onClose,
  onSaveVersion,
  onPromptRevision,
  onSaveToProjectSources
}: ArtifactCanvasProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'source' | 'versions'>('preview');
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(artifact?.currentVersion || 1);
  const [copied, setCopied] = useState(false);
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mermaidSvg, setMermaidSvg] = useState<string>('');
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sync selected version on artifact switch
  useEffect(() => {
    if (artifact) {
      setSelectedVersionNum(artifact.currentVersion);
    }
  }, [artifact?.id, artifact?.currentVersion]);

  const currentVersion: ArtifactVersion | undefined =
    artifact?.versions.find((v) => v.version === selectedVersionNum) ||
    artifact?.versions[artifact.versions.length - 1];

  const content = currentVersion?.content || '';

  // Render Mermaid diagrams safely
  useEffect(() => {
    if (artifact?.type === 'diagram' && content) {
      let isMounted = true;
      setMermaidError(null);
      const renderMermaid = async () => {
        try {
          const id = 'mermaid_' + Math.random().toString(36).substring(2, 9);
          const { svg } = await mermaid.render(id, content);
          if (isMounted) {
            setMermaidSvg(svg);
          }
        } catch (err: any) {
          if (isMounted) {
            console.warn('Mermaid render error:', err);
            setMermaidError(err?.message || 'Invalid Mermaid syntax structure.');
          }
        }
      };
      renderMermaid();
      return () => {
        isMounted = false;
      };
    }
  }, [artifact?.type, content]);

  if (!artifact) {
    return (
      <div id="artifact-canvas-empty" className="h-full flex items-center justify-center p-8 text-center text-stone-400 text-xs">
        No active artifact selected. Click on any artifact card to open the workbench canvas.
      </div>
    );
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = artifact.type === 'html_preview' ? 'html' : artifact.type === 'diagram' ? 'mmd' : 'md';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${artifact.title.toLowerCase().replace(/\s+/g, '_')}_v${selectedVersionNum}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionPrompt.trim()) return;
    onPromptRevision(revisionPrompt.trim(), artifact);
    setRevisionPrompt('');
  };

  return (
    <aside
      id="artifact-canvas-panel"
      className="h-full flex flex-col bg-white border-l border-stone-200 shadow-xl overflow-hidden z-30"
    >
      {/* Canvas Header */}
      <div className="p-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile Back button */}
          <button
            onClick={onClose}
            className="md:hidden flex items-center gap-1 p-1 -ml-1 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
            title="Back to conversation"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-medium">Back</span>
          </button>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-orange-100 text-orange-800 shrink-0">
            {artifact.type.replace('_', ' ')}
          </span>
          <h3 className="font-semibold text-xs text-stone-900 truncate max-w-[140px] sm:max-w-[200px] md:max-w-[280px]">
            {artifact.title}
          </h3>
          <span className="text-[10px] text-stone-400 font-mono shrink-0">v{selectedVersionNum}</span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSaveToProjectSources(artifact)}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            title="Save to Project Knowledge Base"
          >
            <Save size={15} />
          </button>
          <button
            onClick={handleCopyContent}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            title="Copy content"
          >
            {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            title="Download Artifact"
          >
            <Download size={15} />
          </button>
          <button
            onClick={onClose}
            className="hidden md:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors ml-1"
            title="Close Canvas"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Sub-Header Tabs & Controls */}
      <div className="px-3.5 py-2 border-b border-stone-200 flex items-center justify-between text-xs bg-white shrink-0">
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'preview' ? 'bg-white text-stone-900 font-medium shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye size={13} />
            <span>Rendered</span>
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'source' ? 'bg-white text-stone-900 font-medium shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Code2 size={13} />
            <span>Source Code</span>
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'versions' ? 'bg-white text-stone-900 font-medium shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <History size={13} />
            <span>History ({artifact.versions.length})</span>
          </button>
        </div>

        {/* Viewport controls for HTML preview */}
        {artifact.type === 'html_preview' && activeTab === 'preview' && (
          <div className="flex items-center gap-1 text-stone-500">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1 rounded ${viewportMode === 'desktop' ? 'bg-stone-200 text-stone-900' : 'hover:bg-stone-100'}`}
              title="Desktop View"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1 rounded ${viewportMode === 'tablet' ? 'bg-stone-200 text-stone-900' : 'hover:bg-stone-100'}`}
              title="Tablet View (768px)"
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-stone-200 text-stone-900' : 'hover:bg-stone-100'}`}
              title="Mobile View (375px)"
            >
              <Smartphone size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-stone-50/50 scrollbar-thin">
        {activeTab === 'preview' && (
          <div className="h-full">
            {/* 1. Markdown Renderer */}
            {artifact.type === 'markdown' && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto prose prose-stone prose-sm md:prose-base leading-relaxed">
                <div className="whitespace-pre-wrap font-sans text-stone-800">
                  {content}
                </div>
              </div>
            )}

            {/* 2. Mermaid Diagram Renderer */}
            {artifact.type === 'diagram' && (
              <div className="h-full flex flex-col items-center justify-center p-4">
                {mermaidError ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-xs text-red-900 space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-red-950">
                      <AlertCircle size={16} />
                      <span>Mermaid Render Diagnostic</span>
                    </div>
                    <pre className="p-3 bg-white/80 rounded border border-red-200 font-mono text-[11px] overflow-x-auto">
                      {mermaidError}
                    </pre>
                    <button
                      onClick={() => onPromptRevision(`Repair Mermaid diagram syntax error: ${mermaidError}`, artifact)}
                      className="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl font-medium transition-colors"
                    >
                      Repair with Agent
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs w-full overflow-auto flex items-center justify-center min-h-[300px]">
                    <div
                      dangerouslySetInnerHTML={{ __html: mermaidSvg || '<div class="text-stone-400 text-xs">Rendering Mermaid Vector...</div>' }}
                      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. HTML Preview Renderer */}
            {artifact.type === 'html_preview' && (
              <div className="h-full flex items-center justify-center">
                <div
                  className={`h-full bg-white border border-stone-300 rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${
                    viewportMode === 'mobile' ? 'w-[375px]' : viewportMode === 'tablet' ? 'w-[768px]' : 'w-full'
                  }`}
                >
                  <iframe
                    title="Sanitized Artifact Preview"
                    srcDoc={content}
                    sandbox="allow-scripts"
                    className="w-full h-full border-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Source Code Tab */}
        {activeTab === 'source' && (
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto shadow-inner">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        )}

        {/* Version History Tab */}
        {activeTab === 'versions' && (
          <div className="space-y-3 max-w-xl mx-auto">
            <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Version History & Change Log
            </h4>
            <div className="space-y-2">
              {artifact.versions.map((ver) => (
                <div
                  key={ver.version}
                  onClick={() => setSelectedVersionNum(ver.version)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedVersionNum === ver.version
                      ? 'bg-orange-50 border-orange-300 text-orange-950 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-bold text-stone-900">Version {ver.version}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">{ver.changeSummary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Inline "Edit with Agent" Prompt */}
      <form
        onSubmit={handleRevisionSubmit}
        className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
      >
        <Sparkles size={16} className="text-orange-700 shrink-0 ml-1" />
        <input
          type="text"
          value={revisionPrompt}
          onChange={(e) => setRevisionPrompt(e.target.value)}
          placeholder="Ask Lattice to revise or add to this artifact..."
          className="flex-1 text-xs bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-900"
        />
        <button
          type="submit"
          disabled={!revisionPrompt.trim()}
          className="p-2 bg-stone-900 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-2xs"
          title="Send revision request"
        >
          <ArrowRight size={14} />
        </button>
      </form>
    </aside>
  );
}
