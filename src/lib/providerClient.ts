export type ProviderProtocol = 'openai_compatible' | 'anthropic' | 'gemini';

export interface ProviderConfig {
  id: string;
  label: string;
  protocol: ProviderProtocol;
  baseUrl: string;
  apiKey: string;
  defaultModel?: string;
}

export interface ProviderModel { id: string; label: string; contextWindow?: number; capabilities?: string[]; }

const STORAGE_KEY = 'lattice_provider_config';

export function getProviderConfig(): ProviderConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveProviderConfig(config: ProviderConfig | null) {
  if (!config) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function withTrailingSlash(url: string) { return url.replace(/\/$/, ''); }
function authHeaders(config: ProviderConfig) { return { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` }; }

export async function listProviderModels(config: ProviderConfig): Promise<ProviderModel[]> {
  if (config.protocol === 'gemini') {
    const response = await fetch(`${withTrailingSlash(config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta')}/models?key=${encodeURIComponent(config.apiKey)}`);
    if (!response.ok) throw new Error(`Gemini model discovery failed (${response.status})`);
    const data = await response.json();
    return (data.models || []).map((model: any) => ({ id: String(model.name || '').replace(/^models\//, ''), label: model.displayName || model.name, capabilities: model.supportedGenerationMethods || [] }));
  }
  const response = await fetch(`${withTrailingSlash(config.baseUrl)}/models`, { headers: authHeaders(config) });
  if (!response.ok) throw new Error(`Model discovery failed (${response.status})`);
  const data = await response.json();
  const models = Array.isArray(data) ? data : data.data || data.models || [];
  return models.map((model: any) => ({ id: model.id || model.name, label: model.name || model.id, contextWindow: model.context_window || model.contextWindow, capabilities: model.capabilities || [] }));
}

export async function runProviderChat(config: ProviderConfig, model: string, prompt: string, system?: string): Promise<string> {
  if (config.protocol === 'gemini') {
    const response = await fetch(`${withTrailingSlash(config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta')}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemInstruction: system ? { parts: [{ text: system }] } : undefined, contents: [{ role: 'user', parts: [{ text: prompt }] }] }) });
    if (!response.ok) throw new Error(`Gemini request failed (${response.status})`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('') || 'The model returned no text.';
  }
  if (config.protocol === 'anthropic') {
    const response = await fetch(`${withTrailingSlash(config.baseUrl || 'https://api.anthropic.com/v1')}/messages`, { method: 'POST', headers: { ...authHeaders(config), 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model, max_tokens: 4096, system, messages: [{ role: 'user', content: prompt }] }) });
    if (!response.ok) throw new Error(`Anthropic request failed (${response.status})`);
    const data = await response.json();
    return (data.content || []).map((part: any) => part.text || '').join('') || 'The model returned no text.';
  }
  const response = await fetch(`${withTrailingSlash(config.baseUrl)}/chat/completions`, { method: 'POST', headers: authHeaders(config), body: JSON.stringify({ model, temperature: 0.4, messages: [{ role: 'system', content: system || 'You are Lattice, a grounded agentic assistant. Be clear about actions, sources, and limitations.' }, { role: 'user', content: prompt }] }) });
  if (!response.ok) throw new Error(`Provider request failed (${response.status})`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'The model returned no text.';
}
