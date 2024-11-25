import { useFetchStorePosts } from '@/feature/post/services/hook';

const useGetStorePosts = (storeId: number) => {
  const { data: posts } = useFetchStorePosts({
    storeId,
    // selector: (serverData) => {
    //   return serverData.map((post) => ({
    //     id: post.postId,
    //     writerUserName: post.memberUsername,
    //     storeName: post.storeName,
    //     mainMenuName: post.postMainMenu,
    //     menuPrice: post.menuPrice,
    //     createdDate: post.createdDate,
    //     menuImageUrl: post.menuImage.url,
    //     menuImageId: post.menuImage.id,
    //     category: post.category,
    //     updatedDate: post.updatedDate,
    //   }));
    // },
  });

  // const postViewModel = new PostViewModel(post);

  return {
    posts,
  };
};

export default useGetStorePosts;
