import React from 'react';
import { Building2, User } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const Topbar: React.FC = () => {
  const { properties, selectedProperty, setSelectedProperty } = usePropertyStore();

  return (
    <header className="topbar">
      <div className="topbar-left">
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
        <div className="user-profile">
          <span className="user-badge-avatar">
            <User size={15} />
          </span>
          <span className="user-name">PG Manager</span>
        </div>
      </div>
    </header>
  );
};
