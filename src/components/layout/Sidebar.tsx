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
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';

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
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, closeDrawer } = useUIStore();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'P';
  const roleLabel = user?.role === 'owner' ? 'Owner' : user?.role === 'manager' ? 'Manager' : user?.role === 'staff' || user?.role === 'warden' ? 'Staff' : 'Resident';

  const handleNavClick = (path: string) => {
    onNavigate?.(path);
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
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
                  onClick={() => handleNavClick(item.path)}
                >
                  <Icon size={18} className="sidebar-nav-icon" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">{userInitial}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name" title={user?.name || 'PG Manager'}>
              {user?.name || 'PG Manager'}
            </span>
            <span className="sidebar-user-role">{roleLabel}</span>
          </div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={() => logout()}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
