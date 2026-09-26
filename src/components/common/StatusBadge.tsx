import React from 'react';
import { Badge } from '../ui/Badge';

export interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
      case 'paid':
      case 'resolved':
      case 'available':
        return 'success';
      case 'pending':
      case 'in_progress':
      case 'notice':
        return 'warning';
      case 'overdue':
      case 'urgent':
      case 'maintenance':
        return 'danger';
      default:
        return 'default';
    }
  };

  return <Badge variant={getVariant(status)}>{status.replace('_', ' ')}</Badge>;
};
