import { useIntersectionObserver } from '@/hooks';
import { Spacing } from '@/components/layout';
import { Text } from '@/components/ui-kit';
import PostCards from '@/components/feature/post/PostCards/PostCards';
import useGetMyPost from '@/feature/post/adapter/in/useGetMyPost';
import { CategoriesWithAllEN } from '@/types';

interface MyPostScreenProps {
  category: CategoriesWithAllEN;
}
export default function MyPostScreen({ category }: MyPostScreenProps) {
  const { posts, ...rest } = useGetMyPost({ category });
  const { fetchNextPage, hasNextPage, isFetching } = rest;
  const { ref } = useIntersectionObserver({
    onIntersect: (entry) => {
      handleIntersect({
        entry,
        fetchNextPage,
        hasNextPage,
        isFetching,
      });
    },
    threshold: 0.5,
  });

  return posts.length > 0 ? (
    <PostCards posts={posts} refElement={ref} />
  ) : (
    <>
      <Spacing size={16} />
      <Text as="p" fontSize="large" fontWeight="medium" color="#2e2e2e">
        {category === 'ALL'
          ? '포스트를 작성한적이 없어요'
          : CATEGORY_HANGLE_MAP[category as keyof typeof CATEGORY_HANGLE_MAP]}
        (와)과 관련된 글을 작성한적이 없어요 !
      </Text>
    </>
  );
}

const CATEGORY_HANGLE_MAP = {
  ALL: '전체',
  KOREAN: '한식',
  CHINESE: '중식',
  JAPANESE: '일식',
  WESTERN: '양식',
  FASTFOOD: '패스트푸드',
  DESSERT: '디저트',
  CAFE: '카페',
};

const handleIntersect = ({
  entry,
  fetchNextPage,
  hasNextPage,
  isFetching,
}: {
  entry: IntersectionObserverEntry;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
}) => {
  if (entry?.isIntersecting && hasNextPage && !isFetching) {
    fetchNextPage?.();
  }
};
