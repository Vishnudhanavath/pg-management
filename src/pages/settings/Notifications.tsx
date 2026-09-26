import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';

export const Notifications: React.FC = () => {
  return (
    <div className="page-notifications">
      <PageHeader title="Notification Settings" subtitle="WhatsApp, SMS, and email alerts" />
    </div>
  );
};
