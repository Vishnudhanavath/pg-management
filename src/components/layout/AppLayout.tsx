import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AddPropertyModal } from '../../features/properties/components/AddPropertyModal';
import { EditPropertyModal } from '../../features/properties/components/EditPropertyModal';
import { ToastContainer } from '../common/ToastContainer';
import { useUIStore } from '../../store/useUIStore';

export interface AppLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const { isSidebarOpen, closeDrawer } = useUIStore();

  return (
    <div className="app-layout">
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={closeDrawer} />}
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main-wrapper">
        <Topbar onNavigate={onNavigate} />
        <main className="content-area">{children}</main>
      </div>
      <AddPropertyModal />
      <EditPropertyModal />
      <ToastContainer />
    </div>
  );
};
