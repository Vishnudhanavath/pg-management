import React from 'react';
import { Drawer } from '../../../components/ui/Drawer';

export interface MoveInDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoveInDrawer: React.FC<MoveInDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Assign Room / Move In">
      <div>Move In Form Content</div>
    </Drawer>
  );
};
