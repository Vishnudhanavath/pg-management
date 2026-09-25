import { create } from 'zustand';

interface AppState {
  currentPropertyId: string;
  setCurrentPropertyId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPropertyId: 'prop-1',
  setCurrentPropertyId: (id) => set({ currentPropertyId: id }),
}));
