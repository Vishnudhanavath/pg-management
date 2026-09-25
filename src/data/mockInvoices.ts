import type { Invoice } from '../types/invoice';

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1001',
    tenantId: 'tenant-1',
    tenantName: 'Rahul Sharma',
    roomNumber: '101',
    amount: 9500,
    dueDate: '2025-02-05',
    paidDate: '2025-02-04',
    status: 'paid',
    month: 'February 2025',
  },
  {
    id: 'inv-1002',
    tenantId: 'tenant-2',
    tenantName: 'Priya Patel',
    roomNumber: '101',
    amount: 9500,
    dueDate: '2025-02-05',
    status: 'pending',
    month: 'February 2025',
  },
];
