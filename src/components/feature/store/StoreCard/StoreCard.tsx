/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import Link from 'next/link';
import { MouseEvent, MouseEventHandler, useReducer } from 'react';

import { NextImageWithCover } from '@/components/ui';
import { VotedStoreResponse } from '@/types';
import useGetCandidateStores from '@/feature/vote/applications/hooks/useGetCandidateStores';
import { CandidateStore } from '@/components/feature/vote';

import s from './StoreCard.module.scss';

export interface Store {
  storeId: number;
  storeName: string;
  menuImage: {
    id: number;
    url: string;
  };
  postCount: number;
  // eslint-disable-next-line react/no-unused-prop-types
  menuName: string;
}

export default function StoreCards({ stores }: { stores: Store[] }) {
  return (
    <div className={s.cardsContainer}>
      {stores.length > 0 &&
        stores.map((store) => <StoreCard key={store.storeId} {...store} />)}
    </div>
  );
}

export interface VotedStoreCardProps extends VotedStoreResponse {
  handleRemoveVotedStore: MouseEventHandler<HTMLButtonElement>;
}

export interface AddedStore {
  storeId: number;
  storeName: string;
  menuImage: {
    id: number;
    url: string;
  };
}

export function StoreCard({ storeId, storeName, menuImage, postCount }: Store) {
  const { url } = menuImage;

  return (
    <li className={s.container}>
      <Link className={s.linkArea} href={`/store/${storeId}`}>
        <div className={s.wrapper}>
          <div className={s.storeInfoArea}>
            <NextImageWithCover
              src={url ?? '/profile/profile-default-icon-female.svg'}
              alt="profile-img"
              height="80px"
              borderRadius="8px"
              backgroundColor="#aeaeae"
            />
            <p className={s.storeName}>{storeName}</p>
          </div>
          <p className={s.storePostCount}>{`review ${postCount}개`}</p>
        </div>
      </Link>
    </li>
  );
}

export function CandidateStoreList({
  sessionId,
  handleRemoveVotedStore,
}: {
  sessionId: string;
  handleRemoveVotedStore: MouseEventHandler<HTMLButtonElement>;
}) {
  const { candidateStoresViewModels } = useGetCandidateStores(sessionId);

  return (
    <ul className={s.votedStoreCardsContainer}>
      {candidateStoresViewModels.map((model) => (
        <CandidateStore
          key={model.getStoreId()}
          viewModel={model}
          onRemoveCandidateStore={handleRemoveVotedStore}
        />
      ))}
    </ul>
  );
}
