import Link from 'next/link';

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

export default function StoreCards({ stores }: { stores: Store[] }) {
  return (
    <div className={s.cardsContainer}>
      {stores.length > 0 &&
        stores.map((store) => <StoreCard key={store.storeId} {...store} />)}
    </div>
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
