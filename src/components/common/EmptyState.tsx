import React from 'react';
import { Building2 } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {icon || <Building2 size={40} className="empty-svg-icon" />}
      </div>
      <h4 className="empty-title">{title}</h4>
      {description && <p className="empty-description">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
};
