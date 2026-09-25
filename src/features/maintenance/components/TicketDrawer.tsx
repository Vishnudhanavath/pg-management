import React from 'react';
import type { MaintenanceTicket } from '../../../types/maintenance';
import { Drawer } from '../../../components/ui/Drawer';

export interface TicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: MaintenanceTicket | null;
}

export const TicketDrawer: React.FC<TicketDrawerProps> = ({ isOpen, onClose, ticket }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={ticket ? ticket.title : 'Ticket Details'}>
      {ticket && (
        <div>
          <p>Priority: {ticket.priority}</p>
          <p>Status: {ticket.status}</p>
          <p>Description: {ticket.description}</p>
        </div>
      )}
    </Drawer>
  );
};
