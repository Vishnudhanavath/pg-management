import type { Expense } from '../types/expense';

export const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    propertyId: 'prop-1',
    category: 'Electricity',
    amount: 14500,
    date: '2025-02-01',
    description: 'Main EB meter payment',
    paidTo: 'BESCOM',
  },
  {
    id: 'exp-2',
    propertyId: 'prop-1',
    category: 'Water & Tanker',
    amount: 4200,
    date: '2025-02-03',
    description: '2 x 6000L Water Tankers',
    paidTo: 'Sri Balaji Water Supply',
  },
];
