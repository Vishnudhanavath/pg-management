import React from 'react';
import type { Invoice } from '../../../types/invoice';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../lib/utils';

export interface InvoiceTableProps {
  invoices: Invoice[];
  onSelectInvoice?: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onSelectInvoice }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Tenant</th>
          <th>Room</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id} onClick={() => onSelectInvoice?.(inv)} style={{ cursor: 'pointer' }}>
            <td>{inv.id}</td>
            <td>{inv.tenantName}</td>
            <td>{inv.roomNumber}</td>
            <td>{formatCurrency(inv.amount)}</td>
            <td>{inv.dueDate}</td>
            <td>
              <StatusBadge status={inv.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
