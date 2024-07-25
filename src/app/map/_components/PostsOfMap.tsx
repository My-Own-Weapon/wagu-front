import Link from 'next/link';

import { PostOfStoreResponse } from '@/types';
import ImageFill from '@/components/ui/ImageFill';
import Heading from '@/components/ui/Heading';
import useDragScroll from '@/hooks/useDragScroll';

import s from './PostsOfMap.module.scss';

interface Props {
  selectedStoreName: string | undefined;
  selectedStoreId: number | undefined;
  posts: PostOfStoreResponse[];
}

export default function PostsOfMap({
  selectedStoreName,
  selectedStoreId,
  posts,
}: Props) {
  const ref = useDragScroll();
  return (
    <div className={s.container}>
      <div className={s.titleWrapper}>
        <Heading
          as="h3"
          fontSize="16px"
          fontWeight="bold"
          color="black"
          title={
            isNotSelectStore({
              selectedStoreId,
              selectedStoreName,
            })
              ? '지도의 가게를 클릭해보세요 !'
              : `${selectedStoreName} POST`
          }
        />
        {isNoPost({
          posts,
          selectedStoreId,
          selectedStoreName,
        }) && (
          <Link className={s.allPostsAnchor} href={`/store/${selectedStoreId}`}>
            모든 POST 보기
          </Link>
        )}
      </div>

      <ul className={s.postsWrapper} ref={ref}>
        {!isNoPost({
          posts,
          selectedStoreId,
          selectedStoreName,
        }) ? (
          posts?.map(({ menuImage, postId }) => {
            const { url } = menuImage;
            return <PostCard key={postId} imgUrl={url} />;
          })
        ) : (
          <p className={s.noPostsText}>등록된 리뷰가 없어요...</p>
        )}
      </ul>
    </div>
  );
}

function PostCard({ imgUrl }: { imgUrl: string }) {
  return (
    <li>
      <ImageFill
        src={imgUrl}
        width="120px"
        height="120px"
        fill
        alt="post-img"
        borderRadius="4px"
      />
    </li>
  );
}

function isNoPost({
  posts,
  selectedStoreId,
  selectedStoreName,
}: Props & { posts: PostOfStoreResponse[] }) {
  return posts?.length === 0 && selectedStoreId && selectedStoreName;
}

function isNotSelectStore({
  selectedStoreId,
  selectedStoreName,
}: Omit<Props, 'posts'>) {
  return !selectedStoreId && !selectedStoreName;
}
