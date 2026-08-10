import { create } from 'zustand';

/**
 * Client-only UI state. Anything that comes from the backend belongs in React
 * Query (or in Convex's own reactive queries), never here — two caches for the
 * same data always drift.
 */
export interface UiState {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
