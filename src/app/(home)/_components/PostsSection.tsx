import { CategoriesWithAllEN, PostOfStoreResponse } from '@/types';
import { Spacing, Text } from '@/components/ui';
import PostCards from '@/app/(home)/_components/PostCards';

interface PostSectionProps {
  filteredPosts: PostOfStoreResponse[];
  selectedCategory: CategoriesWithAllEN;
}

export default function PostsSection({
  filteredPosts,
  selectedCategory,
}: PostSectionProps) {
  return filteredPosts.length > 0 ? (
    <PostCards posts={filteredPosts} />
  ) : (
    <>
      <Spacing size={16} />
      <Text as="p" fontSize="large" fontWeight="medium" color="#2e2e2e">
        {selectedCategory
          ? `${selectedCategory} 카테고리에 해당하는 포스트가 없어요!`
          : '등록된 포스트가 없습니다.'}
      </Text>
    </>
  );
}
