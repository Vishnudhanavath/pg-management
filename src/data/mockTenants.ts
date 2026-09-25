import type { Tenant } from '../types/tenant';

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    propertyId: 'prop-1',
    roomId: 'room-101',
    roomNumber: '101',
    moveInDate: '2025-01-10',
    depositAmount: 19000,
    monthlyRent: 9500,
    status: 'active',
  },
  {
    id: 'tenant-2',
    name: 'Priya Patel',
    phone: '+91 98123 45678',
    email: 'priya.p@example.com',
    propertyId: 'prop-1',
    roomId: 'room-101',
    roomNumber: '101',
    moveInDate: '2025-01-15',
    depositAmount: 19000,
    monthlyRent: 9500,
    status: 'active',
  },
];
