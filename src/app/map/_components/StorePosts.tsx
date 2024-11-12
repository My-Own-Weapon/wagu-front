import Link from 'next/link';

import {
  Flex,
  NextImageWithCover,
  Spacing,
  Stack,
  Text,
} from '@/components/ui';
import Heading from '@/components/ui/Heading';
import useDragScroll from '@/hooks/useDragScroll';
import { useFetchStorePosts } from '@/feature/post/applications';
import { colors } from '@/constants/theme';

import s from './StorePosts.module.scss';

interface Props {
  selectedStoreName: string;
  selectedStoreId: number;
}

export default function StorePosts({
  selectedStoreName: storeName,
  selectedStoreId: storeId,
}: Props) {
  const { posts } = useFetchStorePosts(storeId);
  const ref = useDragScroll();

  return (
    <Stack style={{ width: '100%' }}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{ width: '100%' }}
      >
        <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
          {`${storeName} POST`}
        </Heading>
        {posts.length > 0 && (
          <Link href={`/store/${storeId}`}>
            <Text
              fontSize="small"
              fontWeight="regular"
              color={colors.grayAsh600}
            >
              모든 POST 보기
            </Text>
          </Link>
        )}
      </Flex>
      <Spacing size={16} />
      {posts.length === 0 ? (
        <Text
          as="p"
          fontSize="small"
          color={colors.grayBlue700}
          fontWeight="regular"
        >
          등록된 리뷰가 없어요...
        </Text>
      ) : (
        <ul className={s.postsWrapper} ref={ref}>
          {posts.map(({ menuImage, postId }) => (
            <PostOfStoreCard
              key={postId}
              imgUrl={menuImage.url}
              postId={postId}
            />
          ))}
        </ul>
      )}
    </Stack>
  );
}

interface PostOfStoreCardProps {
  imgUrl: string;
  postId: number;
}
function PostOfStoreCard({ imgUrl, postId }: PostOfStoreCardProps) {
  return (
    <li>
      <Link href={`/posts/${postId}`}>
        <NextImageWithCover
          src={imgUrl}
          width="120px"
          height="120px"
          alt="post-img"
          borderRadius="4px"
        />
      </Link>
    </li>
  );
}
