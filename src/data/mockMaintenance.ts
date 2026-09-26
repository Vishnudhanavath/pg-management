import type { MaintenanceTicket } from '../types/maintenance';

export const mockMaintenance: MaintenanceTicket[] = [
  {
    id: 'tkt-1',
    propertyId: 'prop-1',
    roomNumber: '101',
    tenantName: 'Rahul Sharma',
    title: 'Geyser heating issue',
    description: 'Hot water not coming in the attached bathroom geyser.',
    category: 'Plumbing',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2025-02-15',
  },
  {
    id: 'tkt-2',
    propertyId: 'prop-1',
    roomNumber: '103',
    tenantName: 'Arun Kumar',
    title: 'Wi-Fi router dead',
    description: 'Wi-Fi coverage in 1st floor wing A is down.',
    category: 'Network',
    priority: 'urgent',
    status: 'open',
    createdAt: '2025-02-16',
  },
];
