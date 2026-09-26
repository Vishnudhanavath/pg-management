import React from 'react';
import type { MaintenanceTicket } from '../../../types/maintenance';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/common/StatusBadge';

export interface TicketCardProps {
  ticket: MaintenanceTicket;
  onClick?: (ticket: MaintenanceTicket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <Card
      title={ticket.title}
      action={<StatusBadge status={ticket.priority} />}
      className="ticket-card"
      onClick={() => onClick?.(ticket)}
    >
      <p className="text-sm">{ticket.description}</p>
      <div className="mt-2 text-xs text-gray-500">
        Room: {ticket.roomNumber ?? 'N/A'} | Status: {ticket.status}
      </div>
    </Card>
  );
};
