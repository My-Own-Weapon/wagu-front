import { create } from 'zustand';

interface UseVoteDoneCountStore {
  voteDoneCount: number;
  voteDoneUserNames: string[];
  increaseVoteDoneCount: () => void;
  addVoteDoneUserName: (userName: string) => void;
  setVoteDoneUserNames: (userNames: string[]) => void;
}

export const useVoteDoneCountStore = create<UseVoteDoneCountStore>((set) => ({
  voteDoneCount: 1,
  voteDoneUserNames: [],
  increaseVoteDoneCount: () => {
    set((state) => ({ voteDoneCount: state.voteDoneCount + 1 }));
  },
  addVoteDoneUserName: (userName: string) => {
    set((state) => ({
      voteDoneUserNames: [...state.voteDoneUserNames, userName],
    }));
  },
  setVoteDoneUserNames: (userNames: string[]) => {
    set({ voteDoneUserNames: [...userNames] });
  },
}));
