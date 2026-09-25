import { useState, useCallback } from 'react';

export function useDrawer<T = unknown>(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((drawerData?: T) => {
    if (drawerData !== undefined) setData(drawerData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return { isOpen, data, open, close };
}
