import {
  PostOfStoreResponse,
  StoreResponse,
  VotedStoreResponse,
} from '@/types';
import { create } from 'zustand';

interface UseSelectedStore {
  selectedStore?: StoreResponse;
  setSelectedStore: (selectedStore: StoreResponse) => void;
}

interface UsePostsOfStore {
  postsOfStore: PostOfStoreResponse[];
  setPostsOfStore: (postsOfStore: PostOfStoreResponse[]) => void;
}

interface UseVotedStore {
  candidateStores: VotedStoreResponse[];
  setCandidateStores: (votedStores: VotedStoreResponse[]) => void;
}

export const useSelectedStore = create<UseSelectedStore>((set) => ({
  selectedStore: undefined,
  setSelectedStore: (selectedStore: StoreResponse) => set({ selectedStore }),
}));

export const usePostsOfStore = create<UsePostsOfStore>((set) => ({
  postsOfStore: [],
  setPostsOfStore: (postsOfStore: PostOfStoreResponse[]) => {
    set({ postsOfStore });
  },
}));

export const useVotedStore = create<UseVotedStore>((set) => ({
  candidateStores: [],
  setCandidateStores: (candidateStores: VotedStoreResponse[]) => {
    set({ candidateStores });
  },
}));
