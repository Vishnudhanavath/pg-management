import React from 'react';
import type { Tenant } from '../../../types/tenant';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../lib/utils';

export interface TenantTableProps {
  tenants: Tenant[];
  onSelectTenant?: (tenant: Tenant) => void;
}

export const TenantTable: React.FC<TenantTableProps> = ({ tenants, onSelectTenant }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Room</th>
          <th>Phone</th>
          <th>Rent</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {tenants.map((t) => (
          <tr key={t.id} onClick={() => onSelectTenant?.(t)} style={{ cursor: 'pointer' }}>
            <td>{t.name}</td>
            <td>Room {t.roomNumber}</td>
            <td>{t.phone}</td>
            <td>{formatCurrency(t.monthlyRent)}</td>
            <td>
              <StatusBadge status={t.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
