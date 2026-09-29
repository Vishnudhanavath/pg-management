import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  activeDrawer: string | null;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  openDrawer: (drawerName: string) => void;
  closeDrawer: () => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isSidebarOpen: true,
  activeDrawer: null,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openDrawer: (drawerName) => set({ activeDrawer: drawerName }),
  closeDrawer: () => set({ activeDrawer: null }),
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    localStorage.setItem('mana-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  initTheme: () => {
    const savedTheme = localStorage.getItem('mana-theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    set({ theme: initialTheme });
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}));
