import React, { useState } from 'react';
import { BedDouble, ChevronRight, Search } from 'lucide-react';
import type { Tenant } from '../../../types/tenant';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../lib/utils';
import { normalizeBedLabel } from '../tenantUtils';

export interface TenantTableProps {
  tenants: Tenant[];
  onSelectTenant?: (tenant: Tenant) => void;
}

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
const formatSharing = (value?: string) => !value ? 'Sharing not set' : /share/i.test(value) ? value : value + ' Share';

export const TenantTable: React.FC<TenantTableProps> = ({ tenants, onSelectTenant }) => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const filteredTenants = tenants.filter((tenant) => {
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || [tenant.name, tenant.phone, tenant.email, tenant.roomNumber, tenant.bedLabel].some((value) => value?.toLowerCase().includes(term));
    const matchesStatus = status === 'all' || tenant.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <section className="tenant-directory">
      <div className="tenant-directory-toolbar">
        <div className="tenant-directory-title">
          <h2>Resident directory</h2>
          <span>{filteredTenants.length} residents</span>
        </div>
        <div className="tenant-directory-filters">
          <label className="tenant-search">
            <Search size={16} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or room number" aria-label="Search by name or room number" />
          </label>
          <select className="tenant-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="notice">Notice</option>
            <option value="moved_out">Moved out</option>
          </select>
        </div>
      </div>
      <Table className="tenant-table">
        <thead>
          <tr><th>Resident</th><th>Room & bed</th><th>Phone</th><th>Monthly rent</th><th>Status</th><th aria-label="Details"></th></tr>
        </thead>
        <tbody>
          {filteredTenants.map((tenant) => (
            <tr key={tenant.id} onClick={() => onSelectTenant?.(tenant)} onKeyDown={(event) => { if (event.key === 'Enter') onSelectTenant?.(tenant); }} tabIndex={0} aria-label={'View details for ' + tenant.name}>
              <td>
                <div className="tenant-table-resident">
                  <span className="tenant-table-avatar">{initials(tenant.name)}</span>
                  <span className="tenant-table-name">{tenant.name}</span>
                </div>
              </td>
              <td>
                <div className="tenant-table-room"><strong>Room {tenant.roomNumber}</strong><span><BedDouble size={12} />{normalizeBedLabel(tenant.bedLabel) || 'Bed not assigned'} · {formatSharing(tenant.sharingType)}</span></div>
              </td>
              <td className="tenant-table-phone">{tenant.phone}</td>
              <td className="tenant-table-rent">{formatCurrency(tenant.negotiatedRent || tenant.monthlyRent)}<span>/month</span></td>
              <td><StatusBadge status={tenant.status} /></td>
              <td className="tenant-row-action" title="View tenant details"><ChevronRight size={17} aria-hidden="true" /></td>
            </tr>
          ))}
          {filteredTenants.length === 0 && <tr><td className="tenant-empty" colSpan={6}>No residents match your search.</td></tr>}
        </tbody>
      </Table>
    </section>
  );
};
