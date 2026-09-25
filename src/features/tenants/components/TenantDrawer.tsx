import React from 'react';
import type { Tenant } from '../../../types/tenant';
import { Drawer } from '../../../components/ui/Drawer';

export interface TenantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const TenantDrawer: React.FC<TenantDrawerProps> = ({ isOpen, onClose, tenant }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={tenant ? tenant.name : 'Tenant Details'}>
      {tenant && (
        <div>
          <p>Phone: {tenant.phone}</p>
          <p>Email: {tenant.email}</p>
          <p>Room: {tenant.roomNumber}</p>
        </div>
      )}
    </Drawer>
  );
};
