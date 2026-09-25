import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { InvoiceTable } from '../../features/billing/components/InvoiceTable';
import { mockInvoices } from '../../data/mockInvoices';

export const Billing: React.FC = () => {
  return (
    <div className="page-billing">
      <PageHeader title="Billing & Invoices" subtitle="Rent collection and payment tracking" />
      <InvoiceTable invoices={mockInvoices} />
    </div>
  );
};
