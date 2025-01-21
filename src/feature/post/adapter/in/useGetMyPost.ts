import { GetMyPostsQuery } from '@/feature/post/application/port/in/GetMyPostsQuery';
import GetMyPostsService from '@/feature/post/application/service/GetMyPostsService';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { container } from '@/feature/diContainer';
import { CategoriesWithAllEN } from '@/types';

const useGetMyPost = ({ category }: { category: CategoriesWithAllEN }) => {
  const getMyPostsQuery: GetMyPostsQuery = container.resolve(GetMyPostsService);
  const result = useSuspenseInfiniteQuery({
    queryKey: [GetMyPostsService.name],
    queryFn: ({ pageParam }) => {
      return getMyPostsQuery.fetchMyPosts({
        page: pageParam,
        size: 12,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.length < 12
        ? STOP_FETCH_POST
        : incrementPage(lastPageParam);
    },
    staleTime: Infinity,
  });
  const posts =
    category === 'ALL'
      ? result.data.pages.flatMap((page) => page)
      : result.data.pages
          .flatMap((page) => page)
          .filter((post) => post.category === category.toLowerCase());

  return {
    posts,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetching: result.isFetching,
  };
};

const STOP_FETCH_POST = undefined;
const incrementPage = (page: number) => {
  return page + 1;
};

export default useGetMyPost;
