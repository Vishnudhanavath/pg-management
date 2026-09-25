import React from 'react';
import type { Expense } from '../../../types/expense';
import { Table } from '../../../components/ui/Table';
import { formatCurrency } from '../../../lib/utils';

export interface ExpenseTableProps {
  expenses: Expense[];
  onSelectExpense?: (expense: Expense) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onSelectExpense }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Paid To</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp.id} onClick={() => onSelectExpense?.(exp)} style={{ cursor: 'pointer' }}>
            <td>{exp.date}</td>
            <td>{exp.category}</td>
            <td>{exp.description}</td>
            <td>{exp.paidTo}</td>
            <td>{formatCurrency(exp.amount)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
