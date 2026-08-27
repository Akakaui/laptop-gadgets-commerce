import React from 'react';
import {
  MessageSquare,
  FolderOpen,
  Layers,
  Cpu,
  Menu
} from 'lucide-react';
import { NavView } from './NavigationRail';

interface MobileTabBarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenMobileMenu: () => void;
  unreadCount?: number;
  artifactsCount?: number;
}

interface TabItem {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export function MobileTabBar({
  currentView,
  onSelectView,
  onOpenMobileMenu,
  artifactsCount = 0
}: MobileTabBarProps) {
  const tabs: TabItem[] = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'artifacts', label: 'Artifacts', icon: Layers, badge: artifactsCount },
    { id: 'connections', label: 'Tools & MCP', icon: Cpu },
  ];

  return (
    <nav
      id="mobile-bottom-tab-bar"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 px-2 py-1.5 flex items-center justify-around shadow-2xl select-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            id={`mobile-tab-${tab.id}`}
            onClick={() => onSelectView(tab.id as NavView)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-orange-500 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <Icon size={20} className={isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer Trigger */}
      <button
        id="mobile-tab-more-btn"
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-stone-400 hover:text-stone-200 transition-all"
        title="More options & workspaces"
      >
        <Menu size={20} className="stroke-[1.7]" />
        <span className="text-[10px] mt-0.5 tracking-tight">More</span>
      </button>
    </nav>
  );
}
