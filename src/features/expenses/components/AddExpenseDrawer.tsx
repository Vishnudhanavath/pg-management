import React from 'react';
import { Drawer } from '../../../components/ui/Drawer';

export interface AddExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseDrawer: React.FC<AddExpenseDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <div>Add expense form</div>
    </Drawer>
  );
};
