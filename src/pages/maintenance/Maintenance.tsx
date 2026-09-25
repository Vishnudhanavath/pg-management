import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { KanbanBoard } from '../../features/maintenance/components/KanbanBoard';
import { mockMaintenance } from '../../data/mockMaintenance';

export const Maintenance: React.FC = () => {
  return (
    <div className="page-maintenance">
      <PageHeader title="Maintenance Requests" subtitle="Manage repairs and issue tickets" />
      <KanbanBoard tickets={mockMaintenance} />
    </div>
  );
};
