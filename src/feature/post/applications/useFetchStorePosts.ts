import { useFetchStorePostsApi } from '@/feature/post/services/hook';

const useFetchStorePosts = (storeId: number) => {
  const { data } = useFetchStorePostsApi(storeId);

  return {
    posts: data,
  };
};

export default useFetchStorePosts;
