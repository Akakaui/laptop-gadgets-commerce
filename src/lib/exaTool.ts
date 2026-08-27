export interface ExaResult { title: string; url: string; publishedDate?: string; author?: string; text?: string; highlights?: string[]; score?: number; }

const STORAGE_KEY = 'lattice_exa_config';
export function getExaApiKey(): string { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').apiKey || ''; } catch { return ''; } }
export function saveExaApiKey(apiKey: string) { localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey })); }

export async function exaSearch(query: string, options: { numResults?: number; includeText?: boolean } = {}): Promise<ExaResult[]> {
  const apiKey = getExaApiKey();
  if (!apiKey) return [];
  const response = await fetch('https://api.exa.ai/search', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }, body: JSON.stringify({ query, type: 'auto', numResults: options.numResults || 5, contents: options.includeText === false ? undefined : { highlights: { maxCharacters: 800 }, text: { maxCharacters: 1800 } } }) });
  if (!response.ok) throw new Error(`Exa search failed (${response.status})`);
  const data = await response.json();
  return (data.results || []).map((result: any) => ({ title: result.title || result.url, url: result.url, publishedDate: result.publishedDate, author: result.author, text: result.text, highlights: result.highlights, score: result.score }));
}
