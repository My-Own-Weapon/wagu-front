import { create } from 'zustand';

interface StoreProps {
  isStreamer: boolean;
  setIsStreamer: (isStreamer: boolean) => void;
}

export const useStore = create<StoreProps>((set) => ({
  isStreamer: false,
  setIsStreamer: (isStreamer) => set({ isStreamer }),
}));
