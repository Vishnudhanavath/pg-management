import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ExpenseTable } from '../../features/expenses/components/ExpenseTable';
import { mockExpenses } from '../../data/mockExpenses';

export const Expenses: React.FC = () => {
  return (
    <div className="page-expenses">
      <PageHeader title="Expenses" subtitle="Track utility, grocery, and vendor expenditures" />
      <ExpenseTable expenses={mockExpenses} />
    </div>
  );
};
