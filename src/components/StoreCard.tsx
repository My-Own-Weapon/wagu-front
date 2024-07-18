'use client';

import Link from 'next/link';
import { useState } from 'react';

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
}

export interface StoreVoteCardProps {
  storeId: number;
  storeName: string;
  menuImage: {
    id: number;
    url: string;
  };
  postCount: number;
  handleAddVote: (e) => void;
  handleDeleteVote: (e) => void;
}

export default function StoreCards({ stores }: { stores: Store[] }) {
  return (
    <div className={s.cardsContainer}>
      {stores.length > 0 &&
        stores.map((store) => <StoreCard key={store.storeId} {...store} />)}
    </div>
  );
}

export function StoreVoteCard({
  storeId,
  storeName,
  menuImage,
  postCount,
  handleAddVote,
  handleDeleteVote,
}: StoreVoteCardProps) {
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const { url } = menuImage;

  return (
    <li className={s.container}>
      <div className={s.linkArea}>
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
          <div
            style={{
              display: 'flex',
            }}
          >
            {isVoted ? (
              <button
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                }}
                data-store-id={storeId}
                type="button"
                onClick={(e) => {
                  handleDeleteVote(e);
                  setIsVoted(false);
                }}
              >
                투표 삭제
              </button>
            ) : (
              <button
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  border: 'none',
                }}
                type="button"
                data-store-id={storeId}
                onClick={(e) => {
                  handleAddVote(e);
                  setIsVoted(true);
                }}
              >
                투표 추가
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function StoreCard({ storeId, storeName, menuImage, postCount }: Store) {
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
