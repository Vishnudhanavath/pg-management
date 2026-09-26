import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  activeDrawer: string | null;
  toggleSidebar: () => void;
  openDrawer: (drawerName: string) => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  activeDrawer: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openDrawer: (drawerName) => set({ activeDrawer: drawerName }),
  closeDrawer: () => set({ activeDrawer: null }),
}));
