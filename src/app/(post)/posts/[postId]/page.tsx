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
      {postModdable && <div className={s.editButton} >수정하기</div>}
      {errorMsg && <div>{errorMsg}</div>}
      {postDetails && (
        <div>
          <div className={s.container} data-id={postDetails.postId}>
            <div className={s.imageWrapper}>
              <ImageFill 
                src={menu?.menuImage.url || '/images/mock-food.png'}
                alt={menu?.menuName || 'food-image'}
                fill
                height="246px"
              />
            </div>
            <div className={s.content}>
              <div className={s.contentHeader}>

                <div className={s.storeInfo}>
                  <div className={s.storeName}>{postDetails.storeName}</div>
                  <div className={s.address}>{address}</div>
                  <div className={s.menuName}>{menu?.menuName}</div>
                  <div className={s.priceBox}>
                    <div className={s.priceImage}></div>
                    <div className={s.menuPrice}>{menu?.menuPrice}</div>
                  </div>
                </div>

                <div className={s.userInfo}>
                  <div className={s.userName}>작성자 : {postDetails.memberUsername}</div>
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
        </div>
      )}
    </div>
  );
}
