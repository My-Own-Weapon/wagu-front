import { postApiService } from '@/feature/post/services/api/postApiService';
import { infiniteQueryOptions } from '@tanstack/react-query';

const postQueryOptions = {
  FetchPosts: ({ page, size }: { page: number; size: number }) => {
    return infiniteQueryOptions({
      queryKey: [postApiService.fetchPosts.name, page],
      queryFn: ({ pageParam }) => {
        return postApiService.fetchPosts({
          page: pageParam,
          size,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        return lastPage.length < size
          ? STOP_FETCH_POST
          : incrementPage(lastPageParam);
      },
      staleTime: Infinity,
    });
  },
};

const incrementPage = (page: number) => {
  return page + 1;
};
const STOP_FETCH_POST = undefined;

export default postQueryOptions;
