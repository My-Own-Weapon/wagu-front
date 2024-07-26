/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import Link from 'next/link';
import { MouseEvent, MouseEventHandler, useState } from 'react';

import { UserIcon } from '@/components/UserIcon';
import ImageFill from '@/components/ui/ImageFill';

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

export interface VotedStoreCardProps {
  storeId: number;
  storeName: string;
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
            <ImageFill
              src={url ?? '/profile/profile-default-icon-female.svg'}
              alt="profile-img"
              fill
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

export function VotedStoreCards({
  stores,
  handleRemoveVotedStore,
}: {
  stores: VotedStoreCardProps[];
  handleRemoveVotedStore: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <ul className={s.votedStoreCardsContainer}>
      {stores.map((store) => (
        <VotedStoreCard
          key={store.storeId}
          {...store}
          handleRemoveVotedStore={handleRemoveVotedStore}
        />
      ))}
    </ul>
  );
}

/* ✅ TODO: 리사이저블한 SVG 만들기 */
function VotedStoreCard({
  storeId,
  storeName,
  handleRemoveVotedStore,
}: VotedStoreCardProps) {
  // const [isVoteDone, setIsVoteDone] = useState<boolean>(false);
  // const { url } = menuImage;

  return (
    <li className={s.votedStoreCardWrapper}>
      <p className={s.storeName}>{storeName}</p>
      <UserIcon
        size="small"
        shape="circle"
        imgSrc="/profile/profile-default-icon-male.svg"
        alt="profile-img"
      />
      <button
        className={s.removeBtn}
        type="button"
        data-store-id={storeId}
        onClick={handleRemoveVotedStore}
      >
        x
      </button>
    </li>
  );
}

export function VotableCards({
  stores,
  handleAddVote,
  handleDeleteVote,
}: {
  stores: Store[];
  handleAddVote: MouseEventHandler;
  handleDeleteVote: MouseEventHandler;
}) {
  return (
    <ul className={s.votableCardsContainer}>
      {stores.map((store) => (
        <VotableCard
          key={store.storeId}
          store={store}
          handleAddVote={handleAddVote}
          handleDeleteVote={handleDeleteVote}
        />
      ))}
    </ul>
  );
}

export function VotableCard({
  store,
  handleAddVote,
  handleDeleteVote,
}: {
  store: Store;
  handleAddVote: (e: MouseEvent) => void;
  handleDeleteVote: (e: MouseEvent) => void;
}) {
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const { storeId } = store;

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
        onClick={
          isVoted
            ? (e) => {
                handleDeleteVote(e);
                setIsVoted(!isVoted);
              }
            : (e) => {
                handleAddVote(e);
                setIsVoted(!isVoted);
              }
        }
      >
        <ImageFill
          src={store.menuImage.url}
          alt="store-img"
          fill
          height="140px"
          borderRadius="8px"
        />
        <div className={s.storeInfoArea}>
          <p className={s.storeName}>{store.storeName}</p>
          <p className={s.menuName}>{store.menuName}</p>
        </div>
      </button>
    </li>
  );
}
