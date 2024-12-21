import { filterPosts } from '@/feature/post/services/in';
import { useFetchMyPost } from '@/feature/post/services/out';
import { CategoriesWithAllEN } from '@/types';

const useFilteredMyPosts = (category: CategoriesWithAllEN) => {
  const result = useFetchMyPost();
  const { posts: allPosts } = result;
  const filteredPosts = filterPosts(allPosts, category);

  return { ...result, posts: filteredPosts };
};

export default useFilteredMyPosts;
