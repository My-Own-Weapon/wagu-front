/* eslint-disable no-shadow */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ImageFill from '@/components/ui/ImageFill';
import { apiService } from '@/services/apiService';
import { CategoriesEN, ProfileWithoutFollowResponse } from '@/types';
import { formatNumberToKRW } from '@/utils';
import { UserIcon, WithText } from '@/components/UserIcon';
import { PROFILE_IMG } from '@/constants/path';
import PostHeader from './_components/PostHeader';

import s from './page.module.scss';

interface Props {
  params: {
    postId: string;
  };
}

interface PostDetailsResponse {
  postId: number;
  memberUsername: string;
  storeName: string;
  storeLocation: {
    address: string;
    posx: string;
    posy: string;
  };
  postMainMenu: string;
  postCategory: CategoriesEN;
  permission: 'PRIVATE';
  menus: MenuResponse[];
  auto: boolean;
  finished: boolean;
}

interface MenuResponse {
  menuId: string;
  menuImage: {
    id: string;
    url: string;
  };
  menuName: string;
  menuPrice: string;
  menuContent: string;
}

const UserIconWithText = WithText(UserIcon);

export default function PostPage({ params: { postId } }: Props) {
  const [postDetails, setPostDetails] = useState<PostDetailsResponse | null>(
    null,
  );
  const [profile, setProfile] = useState<ProfileWithoutFollowResponse | null>(
    null,
  );
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0); // 추가된 상태
  const router = useRouter();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postDetails = await apiService.fetchPost(postId);
        setPostDetails(postDetails);
        const { memberUsername: writer } = postDetails;
        const profile = await apiService.fetchProfileWithoutFollow(writer);
        setProfile(profile);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
          router.back();
        }
      }
    };

    fetchPostDetails();
  }, []);

  const goToNextMenu = () => {
    if (postDetails && postDetails.menus.length > currentMenuIndex + 1) {
      setCurrentMenuIndex(currentMenuIndex + 1);
    }
  };

  const menu = postDetails?.menus[currentMenuIndex];
  const { address } = postDetails?.storeLocation || {};

  return (
    <>
      {/* ✅ TODO: 수정하기 구현 */}
      <PostHeader modable={false} />
      {postDetails && (
        <div className={s.container} data-id={postDetails?.postId}>
          <ImageFill
            src={menu?.menuImage.url || '/images/mock-food.png'}
            alt={menu?.menuName || 'food-image'}
            fill
            height="360px"
          />
          <div className={s.contentWrapper}>
            <div className={s.postInfoArea}>
              <div className={s.postHeader}>
                <div className={s.storeInfo}>
                  <div className={s.storeName}>{postDetails?.storeName}</div>
                  <div className={s.address}>{address}</div>
                </div>
                <UserIconWithText
                  size="small"
                  fontSize="small"
                  color="black"
                  imgSrc={profile?.imageUrl ?? PROFILE_IMG.DEFAULT_MALE}
                  alt="profile-img"
                >
                  {postDetails?.memberUsername}
                </UserIconWithText>
              </div>
              <div className={s.menuInfoArea}>
                <div className={s.menuName}>{menu?.menuName}</div>
                <p className={s.price}>
                  💰 {formatNumberToKRW(Number(menu?.menuPrice))}
                </p>
              </div>
            </div>
            <div className={s.review}>{menu?.menuContent}</div>
            {postDetails.menus.length > 1 &&
              currentMenuIndex < postDetails.menus.length - 1 && (
                <button type="button" onClick={goToNextMenu}>
                  다음 메뉴 보기
                </button>
              )}
          </div>
        </div>
      )}
    </>
  );
}
