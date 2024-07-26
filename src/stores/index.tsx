import {
  PostOfStoreResponse,
  StoreResponse,
  VotedStoreResponse,
} from '@/types';
import { create } from 'zustand';

interface UseSelectedStore {
  selectedStore: StoreResponse | null;
  setSelectedStore: (selectedStore: StoreResponse) => void;
}

interface UsePostsOfStore {
  postsOfStore: PostOfStoreResponse[];
  setPostsOfStore: (postsOfStore: PostOfStoreResponse[]) => void;
}

interface UseVotedStore {
  votedStores: VotedStoreResponse[];
  setVotedStores: (votedStores: VotedStoreResponse[]) => void;
}

export const useSelectedStore = create<UseSelectedStore>((set) => ({
  selectedStore: null,
  setSelectedStore: (selectedStore: StoreResponse) => set({ selectedStore }),
}));

export const usePostsOfStore = create<UsePostsOfStore>((set) => ({
  postsOfStore: [],
  setPostsOfStore: (postsOfStore: PostOfStoreResponse[]) => {
    set({ postsOfStore });
  },
}));

export const useVotedStore = create<UseVotedStore>((set) => ({
  votedStores: [],
  setVotedStores: (votedStores: VotedStoreResponse[]) => set({ votedStores }),
}));
