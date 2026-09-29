import React from 'react';
import { Building2, LogOut, Menu } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';

export interface TopbarProps {
  onNavigate?: (path: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onNavigate }) => {
  const { properties, selectedProperty, setSelectedProperty } = usePropertyStore();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'P';
  const roleLabel = user?.role === 'owner' ? 'Owner / Admin' : user?.role === 'manager' ? 'Warden' : 'Resident';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="property-selector-wrapper">
          <Building2 size={16} className="selector-icon" style={{ color: 'var(--primary)' }} />
          <select
            value={selectedProperty?.id || ''}
            onChange={(e) => {
              const found = properties.find((p) => p.id === e.target.value);
              setSelectedProperty(found ?? null);
            }}
            className="property-selector"
            aria-label="Select Active Property"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="topbar-right">
        <div
          className="topbar-user-profile"
          style={{ cursor: onNavigate ? 'pointer' : 'default' }}
          onClick={() => onNavigate?.('/settings')}
          title="Go to Account Settings"
        >
          <div className="topbar-user-avatar">{userInitial}</div>
          <div className="topbar-user-meta">
            <span className="topbar-user-name">{user?.name || 'PG Manager'}</span>
            <span className="topbar-user-role">{roleLabel}</span>
          </div>
        </div>

        <button
          type="button"
          className="topbar-logout-btn"
          onClick={() => logout()}
          title="Sign out of MANA P.G"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

