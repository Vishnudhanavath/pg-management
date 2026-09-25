import React from 'react';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Users,
  CreditCard,
  Wallet,
  Wrench,
  BarChart3,
  Settings,
} from 'lucide-react';

export interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Properties', path: '/properties', icon: Building2 },
  { label: 'Occupancy', path: '/occupancy', icon: BedDouble },
  { label: 'Tenants', path: '/tenants', icon: Users },
  { label: 'Billing', path: '/billing', icon: CreditCard },
  { label: 'Expenses', path: '/expenses', icon: Wallet },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPath = '/dashboard', onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-wrapper">
          <Building2 size={22} className="brand-icon" />
          <h2>MANA P.G</h2>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <li key={item.path}>
                <button
                  type="button"
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate?.(item.path)}
                >
                  <Icon size={18} className="sidebar-nav-icon" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
