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
  const { toggleSidebar, theme, toggleTheme } = useUIStore();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'P';
  const roleLabel = user?.role === 'owner' ? 'Owner / Admin' : user?.role === 'manager' ? 'Manager' : user?.role === 'staff' || user?.role === 'warden' ? 'Staff' : 'Resident';

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
        <button
          type="button"
          className={`premium-theme-toggle ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle Theme"
        >
          {/* Day Background (Sun & Cloud) */}
          <div className="toggle-bg-icon toggle-bg-day">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="10" r="5" fill="#FDE047" />
              <path d="M8 18A4 4 0 0 1 8 10A5 5 0 0 1 17 9.5A3.5 3.5 0 0 1 17 18Z" fill="#FFFFFF" />
            </svg>
          </div>
          
          {/* Night Background (Moon & Stars) */}
          <div className="toggle-bg-icon toggle-bg-night">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4A7 7 0 1 0 15.5 17.5A7.5 7.5 0 0 1 10 4Z" fill="#FDE047" />
              <path d="M17 5L17.5 6.5L19 7L17.5 7.5L17 9L16.5 7.5L15 7L16.5 6.5Z" fill="#FFFFFF" />
              <path d="M21 11L21.3 12L22.3 12.3L21.3 12.6L21 13.6L20.7 12.6L19.7 12.3L20.7 12Z" fill="#FFFFFF" />
            </svg>
          </div>

          <div className="toggle-thumb" />
        </button>

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
