import React from 'react';
import type { MaintenanceTicket, TicketStatus } from '../../../types/maintenance';
import { TicketCard } from './TicketCard';

export interface KanbanBoardProps {
  tickets: MaintenanceTicket[];
  onSelectTicket?: (ticket: MaintenanceTicket) => void;
}

const COLUMNS: { id: TicketStatus; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tickets, onSelectTicket }) => {
  return (
    <div className="kanban-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {COLUMNS.map((col) => {
        const columnTickets = tickets.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="kanban-column">
            <h4 className="column-title font-semibold mb-3">
              {col.label} ({columnTickets.length})
            </h4>
            <div className="column-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {columnTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onClick={onSelectTicket} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
