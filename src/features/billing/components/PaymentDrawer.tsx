import React from 'react';
import { Drawer } from '../../../components/ui/Drawer';

export interface PaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentDrawer: React.FC<PaymentDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Record Payment">
      <div>Record payment form</div>
    </Drawer>
  );
};
