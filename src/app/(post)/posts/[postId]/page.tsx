'use client';

import { useEffect, useState } from 'react';

import ImageFill from '@/components/ui/ImageFill';
import { apiService } from '@/services/apiService';
import { getCookieValue } from '@/utils';

import s from './page.module.scss';
import { CategoriesEN } from '@/app/page';

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
  postCategory: Exclude<CategoriesEN, 'ALL'>;
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

export default function PostPage({ params: { postId } }: Props) {
  const [postDetails, setPostDetails] = useState<PostDetailsResponse | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0); // 추가된 상태

  const usernameFromCookie = getCookieValue('username');
  const postModdable = postDetails?.memberUsername === usernameFromCookie;

  useEffect(() => {
    apiService
      .fetchPost(postId)
      .then((data) => {
        console.log(data);
        setPostDetails(data);
      })
      .catch((e) => {
        if (e instanceof Error) setErrorMsg(e.message);
      });
  }, [postId]);

  // 메뉴 변경 함수 추가
  const goToNextMenu = () => {
    if (postDetails && postDetails.menus.length > currentMenuIndex + 1) {
      setCurrentMenuIndex(currentMenuIndex + 1);
    }
  };

  const menu = postDetails?.menus[currentMenuIndex]; // 현재 메뉴 정보
  const { address } = postDetails?.storeLocation || {};

  console.log(menu?.menuImage.url);

  return (
    <div>
      {postModdable && <div>수정하기</div>}
      {errorMsg && <div>{errorMsg}</div>}
      {postDetails && (
        <div>
          <div className={s.container} data-id={postDetails.postId}>
            <ImageFill
              src={menu?.menuImage.url || '/images/mock-food.png'}
              alt={menu?.menuName || 'food-image'}
              fill
              height="246px"
            />
            <div>{postDetails.storeName}</div>
            <div>{address}</div>
            <div>작성자 : {postDetails.memberUsername}</div>
            <div>{menu?.menuName}</div>
            <div>{menu?.menuPrice}</div>
            <div>{menu?.menuContent}</div>
            {postDetails.menus.length > 1 &&
              currentMenuIndex < postDetails.menus.length - 1 && (
                <button type="button" onClick={goToNextMenu}>
                  다음 메뉴 보기
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
