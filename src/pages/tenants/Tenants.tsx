import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { TenantTable } from '../../features/tenants/components/TenantTable';
import { mockTenants } from '../../data/mockTenants';

export const Tenants: React.FC = () => {
  return (
    <div className="page-tenants">
      <PageHeader title="Tenants" subtitle="Resident directory and active agreements" />
      <TenantTable tenants={mockTenants} />
    </div>
  );
};
