'use client';

import { useEffect, useState } from 'react';

import ImageFill from '@/components/ui/ImageFill';
import { apiService } from '@/services/apiService';
import { getCookieValue } from '@/utils';

import s from './page.module.scss';

interface Props {
  params: {
    postId: string;
  };
}

interface PostDetails {
  id: string;
  writer: string;
  createDate: string;
  postContent: string;
  postImage: string;
  postMainMenu: string;
  title: string;
  content: string;
}

export default function PostPage({ params: { postId } }: Props) {
  const [postDetails, setPostDetails] = useState<PostDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const usernameFromCookie = getCookieValue('username');
  const postModdable = postDetails?.writer === usernameFromCookie;

  useEffect(() => {
    apiService
      .fetchPost(postId)
      .then((data) => {
        setPostDetails(data);
      })
      .catch((e) => {
        if (e instanceof Error) setErrorMsg(e.message);
      });
  }, [postId]);

  const { id, postContent, postMainMenu, writer } = postDetails || {};

  return (
    <div>
      {postModdable && <div>수정하기</div>}
      {errorMsg && <div>{errorMsg}</div>}
      {postDetails && (
        <div>
          <div className={s.container} data-id={id}>
            <ImageFill
              src="/images/mock-food.png"
              alt={postMainMenu || 'food-image'}
              fill
              height="246px"
            />
            <div>울엄 김치찜 광교역점</div>
            <div>서울 역삼 어딘가</div>
            <div>작성자 : {writer}</div>
            <div>12,000원</div>
            <div>{postContent}</div>
          </div>
        </div>
      )}
    </div>
  );
}
