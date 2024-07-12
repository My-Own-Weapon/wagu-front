import Link from 'next/link';
import { Children, ReactNode } from 'react';

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
  postImage: PostImage;
  menuPrice: string;
  createDate: string;
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
  return <h3 className={s.title}>{title}</h3>;
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
  postImage,
  postMainMenu,
  menuPrice,
  createDate,
}: PostCardProps) {
  return (
    <li className={s.cardContainer} data-id={postId}>
      <Link
        style={{
          width: '100%',
          height: '100%',
        }}
        href={`/posts/${postId}`}
      >
        <div className={s.cardWrapper}>
          <p className={s.storeName}>{storeName}</p>
          <ImageFill
            id={postImage.id}
            src={postImage.url}
            height="60px"
            fill
            borderRadius="4px"
            alt="post-image"
          />
          <div className={s.postDetailsArea}>
            <p>{postMainMenu}</p>
            <p>{createDate}</p>
            <p>{formatNumberToKRW(Number(menuPrice))}</p>
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
