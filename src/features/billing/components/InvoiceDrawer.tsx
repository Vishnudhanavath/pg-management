import React from 'react';
import type { Invoice } from '../../../types/invoice';
import { Drawer } from '../../../components/ui/Drawer';
import { formatCurrency } from '../../../lib/utils';

export interface InvoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const InvoiceDrawer: React.FC<InvoiceDrawerProps> = ({ isOpen, onClose, invoice }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={invoice ? `Invoice ${invoice.id}` : 'Invoice'}>
      {invoice && (
        <div>
          <p>Tenant: {invoice.tenantName}</p>
          <p>Amount: {formatCurrency(invoice.amount)}</p>
          <p>Status: {invoice.status}</p>
        </div>
      )}
    </Drawer>
  );
};
