import {
  UserProfile,
  Project,
  Conversation,
  Message,
  Artifact,
  ProjectSource,
  AgentDefinition,
  SkillDefinition,
  RemoteMcpConnector,
  ScheduledTask,
  MemoryItem,
  AuditEvent,
  MemoryMode
} from '../types';

const STORAGE_KEYS = {
  USER: 'lattice_user_profile',
  PROJECTS: 'lattice_projects',
  CONVERSATIONS: 'lattice_conversations',
  MESSAGES: 'lattice_messages',
  ARTIFACTS: 'lattice_artifacts',
  SOURCES: 'lattice_sources',
  AGENTS: 'lattice_agents',
  SKILLS: 'lattice_skills',
  CONNECTORS: 'lattice_connectors',
  SCHEDULES: 'lattice_schedules',
  MEMORIES: 'lattice_memories',
  AUDIT: 'lattice_audit',
  ACTIVE_NAV: 'lattice_active_nav'
};

const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  displayName: 'Your workspace',
  email: '',
  avatarUrl: '',
  locale: 'en-US',
  timezone: 'America/Los_Angeles',
  theme: 'light',
  reducedMotion: false,
  globalMemoryEnabled: true,
  defaultModel: ''
};

const INITIAL_PROJECTS: Project[] = [];

const INITIAL_MEMORIES: MemoryItem[] = [];

const INITIAL_SOURCES: ProjectSource[] = [];

const INITIAL_ARTIFACTS: Artifact[] = [];

const INITIAL_AGENTS: AgentDefinition[] = [{
  id: 'agent_main_default',
  name: 'Lattice Orchestrator',
  description: 'Primary agent for planning, safe tool use, and accountable task execution.',
  role: 'both',
  model: '',
  purpose: 'Plan, delegate, clarify, and synthesize work without arbitrary machine execution.',
  instructions: 'Use safe artifacts and approved remote tools only. Keep the user informed about plans, actions, and blockers.',
  allowedToolIds: ['tool_exa_search'],
  allowedSkillIds: [],
  memoryPolicy: 'global',
  enabled: true,
  version: '2.5.0'
}];

const INITIAL_SKILLS: SkillDefinition[] = [];

const INITIAL_CONNECTORS: RemoteMcpConnector[] = [];

const INITIAL_SCHEDULES: ScheduledTask[] = [];

const INITIAL_CONVERSATIONS: Conversation[] = [];

const INITIAL_MESSAGES: Message[] = [];

class LatticeStore {
  private listeners: Set<() => void> = new Set();

  constructor() {
    const resetKey = 'lattice_clean_workspace_v3';
    if (!localStorage.getItem(resetKey)) {
      [
        STORAGE_KEYS.USER,
        STORAGE_KEYS.PROJECTS,
        STORAGE_KEYS.CONVERSATIONS,
        STORAGE_KEYS.MESSAGES,
        STORAGE_KEYS.ARTIFACTS,
        STORAGE_KEYS.SOURCES,
        STORAGE_KEYS.AGENTS,
        STORAGE_KEYS.SKILLS,
        STORAGE_KEYS.CONNECTORS,
        STORAGE_KEYS.SCHEDULES,
        STORAGE_KEYS.MEMORIES,
        STORAGE_KEYS.AUDIT
      ].forEach((key) => localStorage.removeItem(key));
      localStorage.setItem(resetKey, 'true');
    }
  }

  private get<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // User
  public getUser(): UserProfile {
    return this.get(STORAGE_KEYS.USER, INITIAL_USER);
  }
  public updateUser(updates: Partial<UserProfile>): void {
    const current = this.getUser();
    this.set(STORAGE_KEYS.USER, { ...current, ...updates });
  }

  // Projects
  public getProjects(): Project[] {
    return this.get<Project[]>(STORAGE_KEYS.PROJECTS, []);
  }
  public getProject(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }
  public saveProject(project: Project): void {
    const list = this.getProjects();
    const idx = list.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      list[idx] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(project);
    }
    this.set(STORAGE_KEYS.PROJECTS, list);
    this.logAudit('Workspace owner', 'save_project', 'project', project.id, `Saved project ${project.name}`);
  }
  public deleteProject(id: string): void {
    const list = this.getProjects().filter((p) => p.id !== id);
    this.set(STORAGE_KEYS.PROJECTS, list);
    this.logAudit('Workspace owner', 'delete_project', 'project', id, `Deleted project ${id}`);
  }

  // Conversations
  public getConversations(): Conversation[] {
    return this.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
  }
  public getConversation(id: string): Conversation | undefined {
    return this.getConversations().find((c) => c.id === id);
  }
  public saveConversation(conv: Conversation): void {
    const list = this.getConversations();
    const idx = list.findIndex((c) => c.id === conv.id);
    if (idx >= 0) {
      list[idx] = { ...conv, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(conv);
    }
    this.set(STORAGE_KEYS.CONVERSATIONS, list);
  }
  public deleteConversation(id: string): void {
    const list = this.getConversations().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.CONVERSATIONS, list);
  }

  // Messages
  public getMessages(conversationId?: string): Message[] {
    const all = this.get<Message[]>(STORAGE_KEYS.MESSAGES, []);
    if (!conversationId) return all;
    return all.filter((m) => m.conversationId === conversationId);
  }
  public addMessage(msg: Message): void {
    const all = this.get<Message[]>(STORAGE_KEYS.MESSAGES, []);
    all.push(msg);
    this.set(STORAGE_KEYS.MESSAGES, all);
  }
  public updateMessage(msgId: string, updates: Partial<Message>): void {
    const all = this.get<Message[]>(STORAGE_KEYS.MESSAGES, []);
    const idx = all.findIndex((m) => m.id === msgId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      this.set(STORAGE_KEYS.MESSAGES, all);
    }
  }

  // Artifacts
  public getArtifacts(projectId?: string): Artifact[] {
    const all = this.get<Artifact[]>(STORAGE_KEYS.ARTIFACTS, []);
    if (!projectId) return all;
    return all.filter((a) => a.projectId === projectId);
  }
  public getArtifact(id: string): Artifact | undefined {
    return this.getArtifacts().find((a) => a.id === id);
  }
  public saveArtifact(artifact: Artifact): void {
    const list = this.get<Artifact[]>(STORAGE_KEYS.ARTIFACTS, []);
    const idx = list.findIndex((a) => a.id === artifact.id);
    if (idx >= 0) {
      list[idx] = { ...artifact, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(artifact);
    }
    this.set(STORAGE_KEYS.ARTIFACTS, list);
  }
  public deleteArtifact(id: string): void {
    this.set(STORAGE_KEYS.ARTIFACTS, this.get<Artifact[]>(STORAGE_KEYS.ARTIFACTS, []).filter((artifact) => artifact.id !== id));
    this.logAudit('Workspace owner', 'delete_artifact', 'artifact', id, `Deleted artifact ${id}`);
  }

  // Sources
  public getSources(projectId?: string): ProjectSource[] {
    const all = this.get<ProjectSource[]>(STORAGE_KEYS.SOURCES, []);
    if (!projectId) return all;
    return all.filter((s) => s.projectId === projectId);
  }
  public addSource(source: ProjectSource): void {
    const list = this.get<ProjectSource[]>(STORAGE_KEYS.SOURCES, []);
    list.unshift(source);
    this.set(STORAGE_KEYS.SOURCES, list);
    this.logAudit('Workspace owner', 'upload_source', 'source', source.id, `Uploaded ${source.name}`);
  }
  public deleteSource(id: string): void {
    const list = this.get<ProjectSource[]>(STORAGE_KEYS.SOURCES, []).filter((s) => s.id !== id);
    this.set(STORAGE_KEYS.SOURCES, list);
    this.logAudit('Workspace owner', 'delete_source', 'source', id, `Deleted source ${id}`);
  }

  // Agents & Skills
  public getAgents(): AgentDefinition[] {
    const agents = this.get<AgentDefinition[]>(STORAGE_KEYS.AGENTS, INITIAL_AGENTS);
    return agents.filter(Boolean);
  }
  public saveAgent(agent: AgentDefinition): void {
    const list = this.getAgents();
    const idx = list.findIndex((a) => a.id === agent.id);
    if (idx >= 0) list[idx] = agent;
    else list.push(agent);
    this.set(STORAGE_KEYS.AGENTS, list);
  }
  public deleteAgent(id: string): void {
    if (id === 'agent_main_default') return;
    this.set(STORAGE_KEYS.AGENTS, this.getAgents().filter((agent) => agent.id !== id));
    this.logAudit('Workspace owner', 'delete_agent', 'agent', id, `Deleted agent ${id}`);
  }
  public getSkills(): SkillDefinition[] {
    return this.get<SkillDefinition[]>(STORAGE_KEYS.SKILLS, []);
  }
  public saveSkill(skill: SkillDefinition): void {
    const list = this.getSkills();
    const idx = list.findIndex((s) => s.id === skill.id);
    if (idx >= 0) list[idx] = skill;
    else list.push(skill);
    this.set(STORAGE_KEYS.SKILLS, list);
  }
  public deleteSkill(id: string): void {
    this.set(STORAGE_KEYS.SKILLS, this.getSkills().filter((skill) => skill.id !== id));
    this.logAudit('Workspace owner', 'delete_skill', 'skill', id, `Deleted skill ${id}`);
  }

  // Connectors
  public getConnectors(): RemoteMcpConnector[] {
    return this.get<RemoteMcpConnector[]>(STORAGE_KEYS.CONNECTORS, []);
  }
  public saveConnector(connector: RemoteMcpConnector): void {
    const list = this.getConnectors();
    const idx = list.findIndex((c) => c.id === connector.id);
    if (idx >= 0) list[idx] = connector;
    else list.unshift(connector);
    this.set(STORAGE_KEYS.CONNECTORS, list);
    this.logAudit('Workspace owner', 'update_connector', 'connector', connector.id, `Updated connector ${connector.displayName}`);
  }
  public deleteConnector(id: string): void {
    const list = this.getConnectors().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.CONNECTORS, list);
    this.logAudit('Workspace owner', 'remove_connector', 'connector', id, `Removed connector ${id}`);
  }

  // Schedules
  public getSchedules(projectId?: string): ScheduledTask[] {
    const all = this.get<ScheduledTask[]>(STORAGE_KEYS.SCHEDULES, []);
    if (!projectId) return all;
    return all.filter((s) => s.projectId === projectId);
  }
  public saveSchedule(task: ScheduledTask): void {
    const list = this.get<ScheduledTask[]>(STORAGE_KEYS.SCHEDULES, []);
    const idx = list.findIndex((s) => s.id === task.id);
    if (idx >= 0) list[idx] = task;
    else list.unshift(task);
    this.set(STORAGE_KEYS.SCHEDULES, list);
    this.logAudit('Workspace owner', 'save_schedule', 'schedule', task.id, `Saved schedule ${task.name}`);
  }
  public deleteSchedule(id: string): void {
    this.set(STORAGE_KEYS.SCHEDULES, this.get<ScheduledTask[]>(STORAGE_KEYS.SCHEDULES, []).filter((schedule) => schedule.id !== id));
    this.logAudit('Workspace owner', 'delete_schedule', 'schedule', id, `Deleted schedule ${id}`);
  }

  // Memories
  public getMemories(projectId?: string, mode?: MemoryMode): MemoryItem[] {
    const all = this.get<MemoryItem[]>(STORAGE_KEYS.MEMORIES, []);
    if (mode === 'temporary_off') return [];
    if (mode === 'project_only' && projectId) {
      return all.filter((m) => m.scope === 'project_only' && m.projectId === projectId);
    }
    return all;
  }
  public saveMemory(item: MemoryItem): void {
    const all = this.get<MemoryItem[]>(STORAGE_KEYS.MEMORIES, []);
    const idx = all.findIndex((m) => m.id === item.id);
    if (idx >= 0) all[idx] = item;
    else all.unshift(item);
    this.set(STORAGE_KEYS.MEMORIES, all);
    this.logAudit('Workspace owner', 'create_memory', 'memory', item.id, `Saved memory item`);
  }
  public deleteMemory(id: string): void {
    const all = this.get<MemoryItem[]>(STORAGE_KEYS.MEMORIES, []).filter((m) => m.id !== id);
    this.set(STORAGE_KEYS.MEMORIES, all);
    this.logAudit('Workspace owner', 'delete_memory', 'memory', id, `Deleted memory item`);
  }
  public clearAllMemories(): void {
    this.set(STORAGE_KEYS.MEMORIES, []);
    this.logAudit('Workspace owner', 'clear_all_memories', 'memory', 'all', 'Cleared all memory items');
  }

  // Audit Logs
  public getAuditLogs(): AuditEvent[] {
    return this.get(STORAGE_KEYS.AUDIT, [
      {
        id: 'aud_001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actor: 'Lattice Primary Orchestrator',
        action: 'run_completed',
        targetType: 'run',
        targetId: 'run_seed_01',
        details: 'Rendered artifact Scandinavian Furniture Positioning v2'
      }
    ]);
  }
  public logAudit(actor: string, action: string, targetType: AuditEvent['targetType'], targetId: string, details: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'aud_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor,
      action,
      targetType,
      targetId,
      details
    });
    this.set(STORAGE_KEYS.AUDIT, logs.slice(0, 100));
  }
}

export const latticeStore = new LatticeStore();
