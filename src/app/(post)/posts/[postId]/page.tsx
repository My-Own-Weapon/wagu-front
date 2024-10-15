'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { NextImageWithCover } from '@/components/ui';
import { apiService } from '@/services/apiService';
import { CategoriesEN, ProfileWithoutFollowResponse } from '@/types';
import { formatNumberToKRW } from '@/utils';
import { UserIcon, WithText } from '@/components/UserIcon';
import { PROFILE_IMG } from '@/constants/path';
import PostHeader from '../_components/PostHeader';

import s from './page.module.scss';

interface Props {
  params: {
    postId: string;
  };
}

export interface PostDetailsResponse {
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

/* ✅ TODO: 수정하기 구현 */
export default function PostPage({ params: { postId } }: Props) {
  const [postDetails, setPostDetails] = useState<PostDetailsResponse | null>(
    null,
  );
  const [profile, setProfile] = useState<ProfileWithoutFollowResponse | null>(
    null,
  );
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const fetchedPostDetails = await apiService.fetchPost(postId);
        const { memberUsername: writer } = fetchedPostDetails;
        const fetchedProfile =
          await apiService.fetchProfileWithoutFollow(writer);

        setPostDetails(fetchedPostDetails);
        setProfile(fetchedProfile);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
          router.back();
        }
      }
    };

    fetchPostDetails();
  }, [postId, router]);

  const goToNextMenu = () => {
    if (postDetails && postDetails.menus.length > currentMenuIndex + 1) {
      setCurrentMenuIndex(currentMenuIndex + 1);
    }
  };

  const menu = postDetails?.menus[currentMenuIndex];
  const { address } = postDetails?.storeLocation || {};

  return (
    <>
      <PostHeader modable={false} />
      {postDetails && (
        <div className={s.container} data-id={postDetails?.postId}>
          <NextImageWithCover
            src={menu?.menuImage?.url || ''}
            alt="menu-image"
            height={360}
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
            <div
              className={s.review}
              dangerouslySetInnerHTML={{
                __html: menu?.menuContent
                  ? menu.menuContent.replace(/\n/g, '<br>')
                  : '',
              }}
            />
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
