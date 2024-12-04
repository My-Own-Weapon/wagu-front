'use client';

import { useReducer } from 'react';

import {
  useGetCandidateStores,
  useRemoveVotedStore,
  useVoteStore,
} from '@/feature/vote/applications/hooks';
import ViewModel from '@/feature/_lib/ViewModel';
import { NextImageWithCover } from '@/components/ui';

import s from './VotableStoreCard.module.scss';

export function VotableStoreCards({ sessionId }: { sessionId: string }) {
  const { candidateStoresViewModels } = useGetCandidateStores(sessionId);
  const { voteStore } = useVoteStore(sessionId);
  const { removeVotedStore } = useRemoveVotedStore(sessionId);

  const handleVoteStore = (storeId: number) => {
    voteStore({ storeId });
  };

  const handleRemoveStore = (storeId: number) => {
    removeVotedStore({ storeId });
  };

  return (
    <ul className={s.votableCardsContainer}>
      {candidateStoresViewModels.map((viewModel) => (
        <VotableStoreCard
          key={viewModel.getStoreId()}
          viewModel={viewModel}
          onVoteStore={handleVoteStore}
          onRemoveStore={handleRemoveStore}
        />
      ))}
    </ul>
  );
}

interface VotableStoreViewModelImpl extends ViewModel {
  getStoreId: () => number;
  getMainMenuName: () => string;
  getMainMenuImageUrl: () => string;
  getStoreName: () => string;
}

export function VotableStoreCard({
  viewModel,
  onVoteStore,
  onRemoveStore,
}: {
  viewModel: VotableStoreViewModelImpl;
  onVoteStore: (storeId: number) => void;
  onRemoveStore: (storeId: number) => void;
}) {
  const [isVoted, toggleVoted] = useReducer((prev) => !prev, false);
  const storeId = viewModel.getStoreId();

  const handleVoteStore = () => {
    onVoteStore(storeId);
    toggleVoted();
  };

  const handleRemoveStore = () => {
    onRemoveStore(storeId);
    toggleVoted();
  };

  return (
    <li
      className={s.votableStoreCardContainer}
      style={{
        opacity: isVoted ? 1 : 0.6,
      }}
    >
      <button
        className={s.voteWrapperBtn}
        type="button"
        data-store-id={storeId}
        onClick={isVoted ? handleRemoveStore : handleVoteStore}
      >
        <NextImageWithCover
          src={viewModel.getMainMenuImageUrl()}
          alt="store-img"
          height="140px"
          borderRadius="8px"
        />
        <div className={s.storeInfoArea}>
          <p className={s.storeName}>{viewModel.getStoreName()}</p>
          <p className={s.menuName}>{viewModel.getMainMenuName()}</p>
        </div>
      </button>
    </li>
  );
}
