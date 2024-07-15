import Link from 'next/link';
import { Children, ReactNode } from 'react';
import Image from 'next/image';

import ImageFill from '@/components/ui/ImageFill';
import { formatNumberToKRW } from '@/utils';
import useDragScroll from '@/hooks/useDragScroll';

import s from './Post.module.scss';

interface PostImage {
  id: string;
  url: string;
}

export interface PostCardProps {
  postId: string;
  storeName: string;
  postMainMenu: string;
  menuImage: PostImage;
  menuPrice: string;
  createdDate: string;
}

interface PostProps {
  children: ReactNode;
}

interface PostTitleProps {
  title: string;
}

export function Post({ children }: PostProps) {
  return <div>{children}</div>;
}

Post.Title = function Title({ title }: PostTitleProps) {
  return (
    <div className={s.titleArea}>
      <Image
        src="/images/bookmark.svg"
        width={20}
        height={20}
        alt="bookmark-icon"
      />
      <h3 className={s.title}>{title}</h3>
    </div>
  );
};

Post.PostCards = function PostList({ posts }: { posts: PostCardProps[] }) {
  const ref = useDragScroll();

  return (
    <ul className={s.cardsContainer} ref={ref}>
      {posts.length > 0
        ? posts.map((post: PostCardProps) => (
            <Post.PostCard key={post.postId} {...post} />
          ))
        : '등록된 포스트가 없습니다.'}
    </ul>
  );
};

Post.PostCard = function PostCard({
  postId,
  storeName,
  menuImage,
  postMainMenu,
  menuPrice,
  createdDate,
}: PostCardProps) {
  if (!menuImage) return null;

  const [date] = createdDate.split('T');
  const [year, month, day] = date.split('-');

  return (
    <li className={s.cardContainer} data-id={postId}>
      <Link href={`/posts/${postId}`}>
        <div className={s.cardWrapper}>
          <p className={s.storeName}>{storeName}</p>
          <ImageFill
            id={menuImage.id}
            src={menuImage.url}
            height="60px"
            fill
            borderRadius="4px"
            alt="post-image"
          />
          <div className={s.postDetailsArea}>
            <p>{postMainMenu}</p>
            <p>{formatNumberToKRW(Number(menuPrice))}</p>
            <p>{`${year}. ${month}. ${day}`}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};

Post.Wrapper = function wrapper({ children }: { children: ReactNode }) {
  const childrenArray = Children.toArray(children);
  const style = childrenArray.length > 1 ? { gap: '20px' } : {};

  return (
    <div className={s.postsWrapper} style={style}>
      {children}
    </div>
  );
};
