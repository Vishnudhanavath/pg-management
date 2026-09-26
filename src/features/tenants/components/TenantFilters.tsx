import React from 'react';

export interface TenantFiltersProps {
  filter: string;
  onFilterChange: (status: string) => void;
}

export const TenantFilters: React.FC<TenantFiltersProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="tenant-filters" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {['all', 'active', 'notice', 'moved_out'].map((status) => (
        <button
          key={status}
          type="button"
          className={`filter-btn ${filter === status ? 'active' : ''}`}
          onClick={() => onFilterChange(status)}
        >
          {status.replace('_', ' ').toUpperCase()}
        </button>
      ))}
    </div>
  );
};
