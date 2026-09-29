import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Properties } from '../pages/properties/Properties';
import { Occupancy } from '../pages/occupancy/Occupancy';
import { Tenants } from '../pages/tenants/Tenants';
import { Billing } from '../pages/billing/Billing';
import { Expenses } from '../pages/expenses/Expenses';
import { Maintenance } from '../pages/maintenance/Maintenance';
import { Reports } from '../pages/reports/Reports';
import { Settings } from '../pages/settings/Settings';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { useAuthStore } from '../store/useAuthStore';
import { ToastContainer } from '../components/common/ToastContainer';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [currentPath, setCurrentPath] = useState(isAuthenticated ? '/dashboard' : '/login');

  // If user is not authenticated, show auth screens
  if (!isAuthenticated) {
    if (currentPath === '/signup') {
      return (
        <>
          <Signup
            onNavigateToLogin={() => setCurrentPath('/login')}
            onSuccess={() => setCurrentPath('/dashboard')}
          />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <Login
          onNavigateToSignup={() => setCurrentPath('/signup')}
          onSuccess={() => setCurrentPath('/dashboard')}
        />
        <ToastContainer />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <Dashboard />;
      case '/properties':
        return <Properties />;
      case '/occupancy':
        return <Occupancy />;
      case '/tenants':
        return <Tenants />;
      case '/billing':
        return <Billing />;
      case '/expenses':
        return <Expenses />;
      case '/maintenance':
        return <Maintenance />;
      case '/reports':
        return <Reports />;
      case '/settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderPage()}
    </AppLayout>
  );
};

