import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';

export const InvoiceDetails: React.FC = () => {
  return (
    <div className="page-invoice-details">
      <PageHeader title="Invoice Details" subtitle="Receipt and line item breakdown" />
    </div>
  );
};
