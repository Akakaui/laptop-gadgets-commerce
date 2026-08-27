import { useState } from 'react';
import {
  FolderOpen,
  Settings,
  CircleHelp,
  Languages,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  Archive,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { LatticeLogo } from './LatticeLogo';
import { Project, Conversation, UserProfile } from '../types';

export type NavView =
  | 'chat'
  | 'projects'
  | 'artifacts'
  | 'sources'
  | 'agents_skills'
  | 'schedules'
  | 'connections'
  | 'memory'
  | 'settings';

interface NavigationRailProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (projectId: string | undefined) => void;
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (convId: string) => void;
  onNewConversation: () => void;
  onNewProject: () => void;
  onDeleteConversation: (convId: string) => void;
  onRenameConversation: (convId: string, newTitle: string) => void;
  onMoveToProject: (convId: string, projectId: string) => void;
  onConvertConversationToSkill: (convId: string) => void;
  user: UserProfile;
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function NavigationRail({
  currentView,
  onSelectView,
  projects,
  activeProjectId,
  onSelectProject,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onNewProject,
  onDeleteConversation,
  onRenameConversation,
  onMoveToProject,
  onConvertConversationToSkill,
  user,
  onOpenSettings,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}: NavigationRailProps) {
  const [activeMenuConvId, setActiveMenuConvId] = useState<string | null>(null);
  const [renameConvId, setRenameConvId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const [moveModalConvId, setMoveModalConvId] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'projects', label: 'Projects', icon: FolderOpen, count: projects.length, section: 'Workspace' }
  ];

  const standaloneConversations = conversations.filter(
    (c) => c.scope === 'standalone' && c.status === 'active'
  );

  const startRename = (conv: Conversation) => {
    setRenameConvId(conv.id);
    setRenameText(conv.title);
    setActiveMenuConvId(null);
  };

  const handleSaveRename = (convId: string) => {
    if (renameText.trim()) {
      onRenameConversation(convId, renameText.trim());
    }
    setRenameConvId(null);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          id="mobile-nav-backdrop"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="navigation-rail"
        className={`fixed inset-y-0 left-0 z-50 bg-stone-900 text-stone-300 flex flex-col transition-all duration-300 ease-in-out border-r border-stone-800 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isMobileOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full md:translate-x-0 md:static'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between p-3.5 border-b border-stone-800">
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => {
              onSelectView('chat');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <LatticeLogo size={28} />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight text-white text-sm">
                  Lattice
                </span>
                <span className="text-[10px] text-stone-500 tracking-[0.16em]">
                  AGENT WORKSPACE
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle */}
            <button
              id="collapse-sidebar-btn"
              onClick={onToggleCollapse}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Mobile Close Button */}
            <button
              id="close-mobile-nav-btn"
              onClick={onCloseMobile}
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

      {/* New Conversation CTA */}
      <div className="p-2.5">
        <button
          id="new-chat-btn"
          onClick={() => {
            onNewConversation();
            onSelectView('chat');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-medium text-xs py-2 px-3 transition-colors shadow-xs ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="New Conversation"
        >
          <Plus size={16} />
          {!isCollapsed && <span>New chat</span>}
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1 scrollbar-thin scrollbar-thumb-stone-800">
        <div className="space-y-0.5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const showSection = !isCollapsed && (index === 0 || navItems[index - 1].section !== item.section);
            return (
              <div key={item.id}>
                {showSection && <div className="px-2 pb-1 pt-3 text-[9px] font-medium uppercase tracking-[0.18em] text-stone-600">{item.section}</div>}
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectView(item.id as NavView);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon size={16} className={isActive ? 'text-orange-500' : 'text-stone-400'} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.count !== undefined && (
                  <span className="text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded-full font-mono">
                    {item.count}
                  </span>
                )}
              </button>
              </div>
            );
          })}
        </div>

        {/* Projects Section */}
        {!isCollapsed && (
          <div className="pt-4 pb-1">
            <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              <span>Projects</span>
              <button
                id="add-project-quick-btn"
                onClick={onNewProject}
                className="hover:text-white p-0.5 rounded transition-colors"
                title="Create Project"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.map((proj) => {
                const isSelected = activeProjectId === proj.id && currentView === 'projects';
                return (
                  <button
                    key={proj.id}
                    id={`project-rail-${proj.id}`}
                    onClick={() => {
                      onSelectProject(proj.id);
                      onSelectView('projects');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-stone-800 text-white font-medium'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    {proj.memoryMode === 'project_only' && (
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-stone-800 text-stone-400 rounded">
                        ISO
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Chats */}
        {!isCollapsed && (
          <div className="pt-3 pb-1">
            <div className="px-2 pb-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              <span>Recent Chats</span>
            </div>
            <div className="space-y-0.5">
              {standaloneConversations.length === 0 && <p className="px-2.5 py-2 text-[11px] leading-5 text-stone-600">Your recent conversations will appear here.</p>}
              {standaloneConversations.slice(0, 6).map((conv) => {
                const isSelected =
                  activeConversationId === conv.id && currentView === 'chat';
                return (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-stone-800 text-white font-medium'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                    }`}
                  >
                    {renameConvId === conv.id ? (
                      <input
                        type="text"
                        value={renameText}
                        onChange={(e) => setRenameText(e.target.value)}
                        onBlur={() => handleSaveRename(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(conv.id);
                          if (e.key === 'Escape') setRenameConvId(null);
                        }}
                        autoFocus
                        className="bg-stone-950 border border-stone-700 text-white text-xs rounded px-1.5 py-0.5 w-full focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => {
                          onSelectConversation(conv.id);
                          onSelectView('chat');
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="truncate text-left flex-1"
                        title={conv.title}
                      >
                        {conv.title}
                      </button>
                    )}

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuConvId(
                            activeMenuConvId === conv.id ? null : conv.id
                          );
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-white p-1 rounded transition-opacity"
                      >
                        <MoreVertical size={13} />
                      </button>

                      {/* Dropdown Menu for Conversation Actions */}
                      {activeMenuConvId === conv.id && (
                        <div
                          className="absolute right-0 top-6 z-50 w-44 bg-stone-900 border border-stone-700 rounded-xl shadow-xl py-1 text-xs text-stone-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => startRename(conv)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-stone-800 text-left"
                          >
                            <Edit2 size={13} />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              setMoveModalConvId(conv.id);
                              setActiveMenuConvId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-stone-800 text-left"
                          >
                            <ArrowRightLeft size={13} />
                            <span>Move to Project</span>
                          </button>
                          <button
                            onClick={() => {
                              onConvertConversationToSkill(conv.id);
                              setActiveMenuConvId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-stone-800 text-left"
                          >
                            <Sparkles size={13} />
                            <span>Convert to Skill</span>
                          </button>
                          <div className="border-t border-stone-800 my-1" />
                          <button
                            onClick={() => {
                              onDeleteConversation(conv.id);
                              setActiveMenuConvId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-950/50 text-red-400 text-left"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Move to Project Modal Overlay */}
      {moveModalConvId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setMoveModalConvId(null)}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-white">Move Conversation to Project</h3>
            <p className="text-xs text-stone-400">
              Select a project workspace. Context will become isolated according to the project's memory mode.
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onMoveToProject(moveModalConvId, p.id);
                    setMoveModalConvId(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 flex items-center justify-between"
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{p.memoryMode}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setMoveModalConvId(null)}
              className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer Profile, settings, and capability access */}
      <div className="relative border-t border-stone-800 p-2.5">
        {showProfileMenu && !isCollapsed && (
          <div className="absolute bottom-[calc(100%+8px)] left-2 right-2 z-50 overflow-hidden rounded-2xl border border-stone-700 bg-[#202020] p-1.5 shadow-2xl">
            <div className="border-b border-stone-700 px-3 py-2.5"><p className="truncate text-xs font-medium text-stone-100">{user.email}</p><p className="mt-0.5 text-[10px] text-stone-500">Workspace controls</p></div>
            <button onClick={() => { onOpenSettings(); setShowProfileMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-stone-300 hover:bg-stone-800 hover:text-white"><Settings size={14} />Settings</button>
            <button onClick={() => setShowProfileMenu(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-stone-300 hover:bg-stone-800 hover:text-white"><Languages size={14} />Language</button>
            <div className="my-1 border-t border-stone-800" />
            <p className="px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-stone-600">Capability controls</p>
            {([['agents_skills', 'Agents & skills'], ['connections', 'MCP connectors'], ['memory', 'Memory'], ['schedules', 'Schedules'], ['sources', 'Sources'], ['artifacts', 'Work products']] as const).map(([view, label]) => <button key={view} onClick={() => { onSelectView(view); setShowProfileMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-xs text-stone-400 hover:bg-stone-800 hover:text-white">{label}</button>)}
            <div className="my-1 border-t border-stone-800" />
            <button onClick={() => setShowProfileMenu(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-stone-400 hover:bg-stone-800 hover:text-white"><CircleHelp size={14} />Get help</button>
          </div>
        )}
        <div
          className="flex cursor-pointer items-center justify-between gap-2.5 min-w-0"
          onClick={() => setShowProfileMenu((open) => !open)}
        >
          <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-semibold text-stone-200 shrink-0">
            {user.displayName.substring(0, 2).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.displayName}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${user.globalMemoryEnabled ? 'bg-emerald-500' : 'bg-stone-500'}`} />
                <span className="text-[10px] text-stone-400">
                  {user.globalMemoryEnabled ? 'Memory Active' : 'Memory Off'}
                </span>
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && <span className="px-1 text-stone-500">⌃</span>}
      </div>
    </aside>
    </>
  );
}
