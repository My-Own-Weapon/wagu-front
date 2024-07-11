import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface PostCardProps {
  id: string;
  storeName: string;
  postMainMenu: string;
  postImage: string;
  postPrice: string;
  createDate: string;

  // ✅ TODO: backend와 상의
  // updateDate?: string | undefined;
}

interface PostProps {
  // title: string;
  // Posts: PostCardProps[];
  children: ReactNode;
}

interface PostTitleProps {
  title: string;
}

export function Post({ children }: PostProps) {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

Post.Title = function Title({ title }: PostTitleProps) {
  return <p>{title}</p>;
};

Post.PostCards = function PostList({ posts }: { posts: PostCardProps[] }) {
  return (
    <ul
      style={{
        display: 'flex',
        border: '1px solid lightpink',
        gap: '16px',
        overflow: 'hidden',
      }}
    >
      {posts.length > 0
        ? posts.map((post: PostCardProps) => (
            <Post.PostCard
              key={post.id}
              {...post}
              postImage="/images/mock-food.png"
            />
          ))
        : '등록된 포스트가 없습니다.'}
    </ul>
  );
};

Post.PostCard = function PostCard({
  id,
  storeName,
  postImage,
  postMainMenu,
  postPrice,
  createDate,
}: PostCardProps) {
  return (
    <li
      style={{
        border: '1px solid lightblue',
      }}
      data-id={id}
    >
      <Link
        style={{
          width: '100%',
          height: '100%',
        }}
        href={`/posts/${id}`}
      >
        <p>{storeName}</p>
        <Image
          src={postImage}
          alt="post-image"
          width={65}
          height={60}
          priority
        />
        <p>{postMainMenu}</p>
        <p>{createDate}</p>
        <p>{postPrice}</p>
      </Link>
    </li>
  );
};
