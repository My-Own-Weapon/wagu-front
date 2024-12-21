import { Post } from '@/feature/post/domains/post';
import { FetchPostsSchema } from '@/feature/post/services/api/postApiService';
import postQueryOptions from '@/feature/post/services/hook/options/queries';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

const useFetchMyPost = () => {
  const result = useSuspenseInfiniteQuery({
    ...postQueryOptions.FetchPosts({ page: 0, size: 5 }),
    select: ({ pageParams, pages }) => {
      return {
        pageParams,
        pages: pages.flatMap((page) => page).map(convertPostEntity),
      };
    },
  });
  const { pages } = result.data;

  return { posts: pages, ...result };
};

const convertPostEntity = (post: FetchPostsSchema[number]): Post => {
  return {
    postId: post.postId,
    store: {
      name: post.storeName,
    },
    menu: {
      name: post.postMainMenu,
      price: post.menuPrice,
      image: {
        id: post.menuImage.id,
        url: post.menuImage.url,
      },
      category: post.category,
    },
    date: {
      createdAt: post.createdDate,
      updatedAt: post.updatedDate ?? undefined,
    },
  };
};

export default useFetchMyPost;
