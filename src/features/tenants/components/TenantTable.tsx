import React, { useState, useRef, useEffect } from 'react';
import { BedDouble, ChevronRight, Search, RotateCcw, X, ChevronDown, Wallet, UserCheck, Check, Phone, Users, DoorClosed } from 'lucide-react';
import type { Tenant } from '../../../types/tenant';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../lib/utils';
import { normalizeBedLabel, getTenantRentStatus } from '../tenantUtils';

export interface TenantTableProps {
  tenants: Tenant[];
  onSelectTenant?: (tenant: Tenant) => void;
}

const AVATAR_PALETTES = [
  { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' }, // indigo
  { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' }, // rose
  { bg: '#fffbeb', text: '#92400e', border: '#fde68a' }, // amber
  { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' }, // emerald
  { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' }, // purple
  { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' }, // sky
];

const getAvatarStyle = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
};

interface FilterOption {
  value: string;
  label: string;
  colorDot?: string;
}

const RENT_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Rent: All', colorDot: '#94a3b8' },
  { value: 'paid', label: 'Rent: Paid', colorDot: '#10b981' },
  { value: 'pending', label: 'Rent: Pending', colorDot: '#f59e0b' },
  { value: 'overdue', label: 'Rent: Overdue', colorDot: '#f43f5e' },
];

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Status: All', colorDot: '#94a3b8' },
  { value: 'active', label: 'Active', colorDot: '#10b981' },
  { value: 'notice', label: 'Notice', colorDot: '#f59e0b' },
  { value: 'moved_out', label: 'Moved out', colorDot: '#64748b' },
];

interface FilterDropdownProps {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  ariaLabel: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  icon,
  value,
  onChange,
  options,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="tenant-filter-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`tenant-filter-pill ${value !== 'all' ? `is-filtered status-${value}` : ''} ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <span className="tenant-filter-icon">{icon}</span>
        <span className="tenant-filter-value">{selectedOption.label}</span>
        <ChevronDown size={13} className={`tenant-filter-chevron ${isOpen ? 'is-rotated' : ''}`} />
      </button>

      {isOpen && (
        <div className="tenant-filter-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`tenant-filter-option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
              >
                <div className="tenant-filter-option-left">
                  {opt.colorDot && (
                    <span
                      className="tenant-filter-dot"
                      style={{ backgroundColor: opt.colorDot }}
                    />
                  )}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={14} className="tenant-filter-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
const formatSharing = (value?: string) => !value ? 'Sharing not set' : /share/i.test(value) ? value : value + ' Share';

export const TenantTable: React.FC<TenantTableProps> = ({ tenants, onSelectTenant }) => {
  const [query, setQuery] = useState('');
  const [rentStatus, setRentStatus] = useState('all');
  const [status, setStatus] = useState('all');

  const hasActiveFilters = Boolean(
    query.trim() ||
    rentStatus !== 'all' ||
    status !== 'all'
  );

  const handleResetFilters = () => {
    setQuery('');
    setRentStatus('all');
    setStatus('all');
  };

  const filteredTenants = tenants.filter((tenant) => {
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || [tenant.name, tenant.phone, tenant.email, tenant.roomNumber, tenant.bedLabel].some((value) => value?.toLowerCase().includes(term));
    const matchesStatus = status === 'all' || tenant.status === status;
    const currentRentStatus = getTenantRentStatus(tenant);
    const matchesRentStatus = rentStatus === 'all' || currentRentStatus === rentStatus;
    return matchesQuery && matchesRentStatus && matchesStatus;
  });

  return (
    <section className="tenant-directory">
      <div className="tenant-directory-toolbar">
        <div className="tenant-directory-title">
          <h2>Resident directory</h2>
          <span className="tenant-directory-count">{filteredTenants.length} residents</span>
        </div>
        <div className="tenant-directory-filters">
          <label className="tenant-search">
            <Search size={15} className="tenant-search-icon" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, bed..." aria-label="Search by name or room number" />
            {query && (
              <button
                type="button"
                className="tenant-search-clear"
                onClick={() => setQuery('')}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </label>
          <FilterDropdown
            icon={<Wallet size={14} aria-hidden="true" />}
            value={rentStatus}
            onChange={setRentStatus}
            options={RENT_OPTIONS}
            ariaLabel="Filter by rent status"
          />
          <FilterDropdown
            icon={<UserCheck size={14} aria-hidden="true" />}
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            ariaLabel="Filter by tenant status"
          />
          <button
            type="button"
            className={`tenant-reset-icon-btn ${hasActiveFilters ? 'is-active' : ''}`}
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            title={hasActiveFilters ? "Reset filters" : "No filters to reset"}
            aria-label="Reset filters"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <Table className="tenant-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Room & bed</th>
            <th>Phone</th>
            <th>Monthly rent</th>
            <th>Rent status</th>
            <th>Tenant status</th>
            <th aria-label="Details"></th>
          </tr>
        </thead>
        <tbody>
          {filteredTenants.map((tenant) => {
            const avatarStyle = getAvatarStyle(tenant.name);
            const currentRentStatus = getTenantRentStatus(tenant);
            return (
              <tr
                key={tenant.id}
                onClick={() => onSelectTenant?.(tenant)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') onSelectTenant?.(tenant);
                }}
                tabIndex={0}
                aria-label={'View details for ' + tenant.name}
              >
                <td>
                  <div className="tenant-table-resident">
                    <span
                      className="tenant-table-avatar"
                      style={{
                        backgroundColor: avatarStyle.bg,
                        color: avatarStyle.text,
                        borderColor: avatarStyle.border,
                      }}
                    >
                      {initials(tenant.name)}
                    </span>
                    <div className="tenant-table-name-wrap">
                      <span className="tenant-table-name">{tenant.name}</span>
                      <span className="tenant-table-email">{tenant.email || 'Resident'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="tenant-table-room">
                    <span className="tenant-room-badge">
                      <DoorClosed size={12} className="tenant-room-icon" />
                      <strong>Room {tenant.roomNumber}</strong>
                    </span>
                    <div className="tenant-bed-tags">
                      <span className="tenant-bed-pill">
                        <BedDouble size={11} />
                        {normalizeBedLabel(tenant.bedLabel) || 'Bed not assigned'}
                      </span>
                      {tenant.sharingType && (
                        <span className="tenant-sharing-pill">
                          <Users size={11} />
                          {formatSharing(tenant.sharingType)}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="tenant-table-phone">
                  <div className="tenant-phone-wrap">
                    <Phone size={12} className="tenant-phone-icon" />
                    <span>{tenant.phone}</span>
                  </div>
                </td>
                <td className="tenant-table-rent">
                  <div className="tenant-rent-wrap">
                    <strong>{formatCurrency(tenant.negotiatedRent || tenant.monthlyRent)}</strong>
                    <span className="tenant-rent-period">/month</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={currentRentStatus} />
                </td>
                <td>
                  <StatusBadge status={tenant.status} />
                </td>
                <td className="tenant-row-action" title="View tenant details">
                  <span className="tenant-action-circle">
                    <ChevronRight size={15} aria-hidden="true" />
                  </span>
                </td>
              </tr>
            );
          })}
          {filteredTenants.length === 0 && (
            <tr>
              <td className="tenant-empty" colSpan={7}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span>No residents match your selected filters.</span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="tenant-clear-filters-btn"
                      onClick={handleResetFilters}
                    >
                      <RotateCcw size={13} />
                      <span>Clear all filters</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </section>
  );
};
