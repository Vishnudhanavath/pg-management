import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';

export const TenantProfile: React.FC = () => {
  return (
    <div className="page-tenant-profile">
      <PageHeader title="Tenant Profile" subtitle="Resident history, KYC, and payments" />
    </div>
  );
};
