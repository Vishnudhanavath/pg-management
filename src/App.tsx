import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { useUIStore } from './store/useUIStore';

export default function App() {
  const initTheme = useUIStore((state) => state.initTheme);
  
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <AppRoutes />;
}
