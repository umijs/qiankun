import { create } from 'zustand';

export interface GlobalState {
  user?: {
    name: string;
    avatar?: string;
  };
  theme?: 'light' | 'dark';
  [key: string]: any;
}

interface QiankunStore {
  globalState: GlobalState;
  activeApp: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  initGlobalState: (state: GlobalState) => void;
  setGlobalState: (state: Partial<GlobalState>) => void;
  setActiveApp: (app: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useQiankunStore = create<QiankunStore>((set, get) => ({
  globalState: {},
  activeApp: null,
  loading: false,
  error: null,

  initGlobalState: (state: GlobalState) => {
    set({
      globalState: state,
    });
  },

  setGlobalState: (state: Partial<GlobalState>) => {
    const { globalState } = get();
    set({ globalState: { ...globalState, ...state } });
  },

  setActiveApp: (app: string | null) => {
    set({ activeApp: app, error: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
