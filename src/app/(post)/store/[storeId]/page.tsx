/**
 * SSR과 CSR의 차이를 확인하기 위해 두 가지 방식으로 작성해 두었습니다.
 *
 * SSR과 CSR 모두 DOM content를 load하는데 13초로 같은 시간이 걸렸습니다.
 * 하지만 SSR의 경우 image를 load하는데 CSR보다 약 8초 빨리 load되었습니다.
 */
import { apiService } from '@/services/apiService';
import PostCards from '@/app/(home)/_components/PostCards';

interface Props {
  params: { storeId: string };
}

export default async function StorePage({ params }: Props) {
  const { storeId } = params;
  const posts = await apiService.fetchPostsOfStore(Number(storeId));

  return (
    <main>
      <PostCards posts={posts} />
    </main>
  );
}

// 'use client';
// import PostCards from '@/app/(home)/_components/PostCards';

// import { apiService } from '@/services/apiService';
// import { PostOfStoreResponse } from '@/types';
// import { useEffect, useState } from 'react';

// interface Props {
//   params: { storeId: string };
// }

// export default function StorePage({ params }: Props) {
//   const { storeId } = params;
//   const [posts, setPosts] = useState<PostOfStoreResponse[]>([]);

//   useEffect(() => {
//     apiService
//       .fetchPostsOfStore(Number(storeId))
//       .then((postsData) => {
//         setPosts(postsData);
//       })
//       .catch((e) => {
//         alert(e.message);
//       });
//   }, [storeId]);

//   return (
//     <main>
//       <PostCards posts={posts} />
//     </main>
//   );
// }
