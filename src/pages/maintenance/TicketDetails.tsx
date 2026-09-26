import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';

export const TicketDetails: React.FC = () => {
  return (
    <div className="page-ticket-details">
      <PageHeader title="Ticket Details" subtitle="Issue timeline and resolution" />
    </div>
  );
};
