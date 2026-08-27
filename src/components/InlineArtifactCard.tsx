import React, { useEffect, useMemo, useState } from 'react';
import { Check, Code2, Copy, Download, Eye, FileText, History, Save, Sparkles } from 'lucide-react';
import mermaid from 'mermaid';
import { Artifact, ArtifactVersion } from '../types';

interface InlineArtifactCardProps {
  artifact: Artifact;
  onPromptRevision: (prompt: string, artifact: Artifact) => void;
  onSaveToProjectSources: (artifact: Artifact) => void;
  onSaveVersion: (artifactId: string, content: string, summary: string) => void;
}

function parseCsv(content: string) {
  return content.trim().split(/\r?\n/).slice(0, 80).map((line) => line.split(/,|\t/).map((cell) => cell.trim().replace(/^"|"$/g, '')));
}

export function InlineArtifactCard({ artifact, onPromptRevision, onSaveToProjectSources, onSaveVersion }: InlineArtifactCardProps) {
  const [tab, setTab] = useState<'preview' | 'source' | 'history'>('preview');
  const [version, setVersion] = useState(artifact.currentVersion);
  const [copied, setCopied] = useState(false);
  const [revision, setRevision] = useState('');
  const [diagram, setDiagram] = useState('');
  const current: ArtifactVersion | undefined = artifact.versions.find((item) => item.version === version) || artifact.versions[artifact.versions.length - 1];
  const content = current?.content || '';
  const rows = useMemo(() => artifact.type === 'table' ? parseCsv(content) : [], [artifact.type, content]);

  useEffect(() => {
    if (artifact.type !== 'diagram' || !content) return;
    let active = true;
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' });
    mermaid.render(`inline_${artifact.id.replace(/[^a-z0-9]/gi, '')}_${version}`, content).then(({ svg }) => active && setDiagram(svg)).catch(() => active && setDiagram('<p>Diagram source is available in the Source tab.</p>'));
    return () => { active = false; };
  }, [artifact.id, artifact.type, content, version]);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const ext = artifact.type === 'diagram' ? 'mmd' : artifact.type === 'html_preview' ? 'html' : artifact.type === 'svg' ? 'svg' : artifact.type === 'table' ? 'csv' : 'md';
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${artifact.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-v${version}.${ext}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const submitRevision = (event: React.FormEvent) => {
    event.preventDefault();
    if (!revision.trim()) return;
    onPromptRevision(revision.trim(), artifact);
    setRevision('');
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-700/70 bg-[#171615] shadow-lg" aria-label={`Artifact ${artifact.title}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-700/70 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-400/12 text-orange-300"><FileText size={14} /></div>
          <div className="min-w-0"><p className="truncate text-xs font-medium text-stone-100">{artifact.title}</p><p className="truncate text-[10px] text-stone-500">{artifact.description || `${artifact.type.replace('_', ' ')} · version ${version}`}</p></div>
        </div>
        <div className="flex items-center gap-1 text-stone-500">
          <button onClick={() => onSaveToProjectSources(artifact)} className="rounded-md p-1.5 hover:bg-stone-800 hover:text-stone-100" title="Save to project knowledge"><Save size={14} /></button>
          <button onClick={copy} className="rounded-md p-1.5 hover:bg-stone-800 hover:text-stone-100" title="Copy artifact source">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
          <button onClick={download} className="rounded-md p-1.5 hover:bg-stone-800 hover:text-stone-100" title="Download artifact"><Download size={14} /></button>
        </div>
      </header>

      <div className="flex items-center justify-between border-b border-stone-800 px-3 py-2">
        <div className="flex items-center gap-1 rounded-lg bg-stone-900 p-0.5">
          {([['preview', Eye, 'Rendered'], ['source', Code2, 'Source'], ['history', History, `History ${artifact.versions.length}`]] as const).map(([key, Icon, label]) => <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] ${tab === key ? 'bg-stone-700 text-stone-100' : 'text-stone-500 hover:text-stone-200'}`}><Icon size={12} />{label}</button>)}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-600">{artifact.type.replace('_', ' ')}</span>
      </div>

      <div className="max-h-[460px] overflow-auto p-3">
        {tab === 'preview' && artifact.type === 'html_preview' && <iframe title="Safe inline HTML preview" srcDoc={content} sandbox="allow-scripts" className="h-[360px] w-full rounded-xl border border-stone-700 bg-white" />}
        {tab === 'preview' && artifact.type === 'diagram' && <div className="flex min-h-[220px] items-center justify-center overflow-auto rounded-xl bg-white p-5" dangerouslySetInnerHTML={{ __html: diagram || '<p style="color:#78716c;font:12px sans-serif">Rendering diagram…</p>' }} />}
        {tab === 'preview' && artifact.type === 'table' && <div className="overflow-auto rounded-xl border border-stone-700"><table className="min-w-full text-left text-xs text-stone-300"><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-stone-800 last:border-0">{row.map((cell, cellIndex) => rowIndex === 0 ? <th key={cellIndex} className="bg-stone-900 px-3 py-2 font-medium text-stone-100">{cell}</th> : <td key={cellIndex} className="px-3 py-2">{cell}</td>)}</tr>)}</tbody></table></div>}
        {tab === 'preview' && artifact.type === 'svg' && <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-white p-5"><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(content)}`} alt={artifact.title} className="max-h-[320px] max-w-full" /></div>}
        {tab === 'preview' && !['html_preview', 'diagram', 'table', 'svg'].includes(artifact.type) && <article className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap rounded-xl bg-stone-900/60 p-4 text-stone-300">{content}</article>}
        {tab === 'source' && <pre className="overflow-auto rounded-xl bg-[#0d0c0c] p-4 text-[11px] leading-6 text-stone-300">{content}</pre>}
        {tab === 'history' && <div className="space-y-2">{artifact.versions.map((item) => <button key={item.version} onClick={() => { setVersion(item.version); setTab('preview'); }} className={`w-full rounded-xl border p-3 text-left ${version === item.version ? 'border-orange-400/50 bg-orange-400/10' : 'border-stone-700 bg-stone-900/60'}`}><div className="flex items-center justify-between text-xs text-stone-200"><span>Version {item.version}</span><span className="font-mono text-[10px] text-stone-600">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div><p className="mt-1 text-[11px] text-stone-500">{item.changeSummary}</p></button>)}</div>}
      </div>

      <form onSubmit={submitRevision} className="flex items-center gap-2 border-t border-stone-800 px-3 py-2.5"><Sparkles size={14} className="shrink-0 text-orange-300" /><input value={revision} onChange={(event) => setRevision(event.target.value)} placeholder="Ask Lattice to revise this work product…" className="min-w-0 flex-1 bg-transparent text-xs text-stone-200 outline-none placeholder:text-stone-600" /><button type="submit" disabled={!revision.trim()} className="rounded-lg bg-stone-700 px-2.5 py-1.5 text-[10px] text-stone-200 disabled:opacity-40">Revise</button></form>
    </section>
  );
}

export default InlineArtifactCard;
