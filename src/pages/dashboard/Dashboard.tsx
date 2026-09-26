import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';

export const Dashboard: React.FC = () => {
  return (
    <div className="page-dashboard">
      <PageHeader title="Dashboard" subtitle="Overview of your properties and operations" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Occupancy">
          <p className="text-2xl font-bold">88%</p>
        </Card>
        <Card title="Active Tenants">
          <p className="text-2xl font-bold">42</p>
        </Card>
        <Card title="Pending Rent">
          <p className="text-2xl font-bold">₹38,000</p>
        </Card>
        <Card title="Open Maintenance">
          <p className="text-2xl font-bold">3</p>
        </Card>
      </div>
    </div>
  );
};
