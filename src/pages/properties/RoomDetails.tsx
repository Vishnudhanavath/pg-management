import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';

export const RoomDetails: React.FC = () => {
  return (
    <div className="page-room-details">
      <PageHeader title="Room Details" subtitle="Manage beds, amenities, and room status" />
    </div>
  );
};
