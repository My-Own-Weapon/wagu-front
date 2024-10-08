/* eslint-disable no-console */
import { Store } from '@/components/StoreCard';
import { User } from '@/components/UserCard';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/login', () => {
    console.log('mock Api : login sucess !!');

    return HttpResponse.json({
      headers: { 'Set-Cookie': 'JSESSIONID=helloworld' },
      status: 200,
      ok: true,
    });

    /* unauthorization */
    // return HttpResponse.json({
    //     headers: {
    //       status: 401,
    //       ok: false,
    //     },
    //   });
  }),

  http.post('/logout', () => {
    console.log('mock Api : 로그아웃 !!');

    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0',
      },
    });
  }),

  http.post('/join', async () => {
    console.log('mock Api : 회원가입 !!');
    /* 중복된 유저 */
    // return HttpResponse.text(JSON.stringify('Already exists user'), {
    //   status: 403,
    // });

    /* 성공 */
    return HttpResponse.json({
      message: '성공',
      succ: true,
    });
  }),

  http.get('/posts', () => {
    console.log('fetch all post !!');

    return HttpResponse.json(getMockPosts());
  }),

  http.get('/posts/:postId', ({ request }) => {
    console.log('fetch post !!');

    const splitedUrl = request.url.split('/');
    const path = Number(splitedUrl[splitedUrl.length - 1]);

    if (path % 2 === 0) return HttpResponse.json(getMockPostPossiblePatch());

    return HttpResponse.json(getMockPostNotPossiblePatch());
  }),

  http.get('/followings', () => {
    console.log('fetch live friends !!');

    return HttpResponse.json(getFollowings());
  }),

  http.get('/members', ({ request }) => {
    console.log('fetch members !!');

    const url = new URL(request.url);
    const query = url.searchParams.get('username');

    if (!query) {
      return new HttpResponse(null, { status: 404 });
    }

    if (query.includes('a')) {
      return HttpResponse.json(getUserIncludeA());
    }

    return HttpResponse.json(getUserNotIncludeA());
  }),

  http.get('/stores', ({ request }) => {
    console.log('fetch members !!');

    const url = new URL(request.url);
    const query = url.searchParams.get('keyword');

    if (!query) {
      return new HttpResponse(null, { status: 404 });
    }

    if (query.includes('a')) {
      return HttpResponse.json(getStoresIncludeA());
    }

    return HttpResponse.json(getStoresNotIncludeA());
  }),

  http.get('/map/posts', () => {
    return HttpResponse.json(getMockPostsOfStroe());
  }),
];

function getStoresIncludeA(): Store[] {
  return [
    {
      storeId: 1,
      storeName: 'a김치찜',
      menuImage: {
        id: 1,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 2,
      storeName: 'a김치찜',
      menuImage: {
        id: 2,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 3,
      storeName: 'a김치찜',
      menuImage: {
        id: 3,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 4,
      storeName: 'a김치찜',
      menuImage: {
        id: 4,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 5,
      storeName: 'a김치찜',
      menuImage: {
        id: 5,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
  ];
}

function getStoresNotIncludeA(): Store[] {
  return [
    {
      storeId: 1,
      storeName: 'bc김치찜',
      menuImage: {
        id: 1,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 2,
      storeName: 'bc김치찜',
      menuImage: {
        id: 2,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 3,
      storeName: 'bcd김치찜',
      menuImage: {
        id: 3,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 4,
      storeName: 'bcde김치찜',
      menuImage: {
        id: 4,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
    {
      storeId: 5,
      storeName: 'bcdef김치찜',
      menuImage: {
        id: 5,
        url: '/images/mock-food.png',
      },
      postCount: 1,
      menuName: '김치찜',
    },
  ];
}

function getUserIncludeA(): User[] {
  return [
    {
      memberId: 1,
      memberUsername: 'a김철수',
      memberImage: {
        id: '1',
        url: '/profile/profile-default-icon-male.svg',
      },
      to: true,
      from: true,
      each: true,
    },
    {
      memberId: 2,
      memberUsername: 'a신짱구',
      memberImage: {
        id: '2',
        url: '/profile/profile-default-icon-male.svg',
      },
      to: false,
      from: true,
      each: false,
    },
    {
      memberId: 3,
      memberUsername: 'a이유리',
      memberImage: {
        id: '3',
        url: null,
      },
      to: true,
      from: false,
      each: false,
    },
    {
      memberId: 4,
      memberUsername: 'a훈이',
      memberImage: {
        id: '4',
        url: '/profile/profile-default-icon-male.svg',
      },
      to: true,
      from: true,
      each: true,
    },
    {
      memberId: 5,
      memberUsername: 'a맹구',
      memberImage: {
        id: '5',
        url: null,
      },
      to: true,
      from: false,
      each: false,
    },
  ];
}

function getUserNotIncludeA(): User[] {
  return [
    {
      memberId: 1,
      memberUsername: 'bc김철수',
      memberImage: {
        id: '1',
        url: '/profile/profile-default-icon-male.svg',
      },
      to: false,
      from: true,
      each: false,
    },
    {
      memberId: 2,
      memberUsername: 'bc신짱구',
      memberImage: {
        id: '2',
        url: '/profile/profile-default-icon-male.svg',
      },
      to: false,
      from: true,
      each: false,
    },
    {
      memberId: 3,
      memberUsername: 'bcd훈이',
      memberImage: {
        id: '3',
        url: null,
      },
      to: true,
      from: false,
      each: false,
    },
    {
      memberId: 4,
      memberUsername: 'bcde이유리',
      memberImage: {
        id: '4',
        url: '/profile/profile-default-icon-male.svg',
      },
      to: true,
      from: false,
      each: false,
    },
    {
      memberId: 5,
      memberUsername: 'bcdef맹구',
      memberImage: {
        id: '5',
        url: null,
      },
      to: true,
      from: false,
      each: false,
    },
  ];
}

function getMockPosts() {
  return [
    {
      postId: 1,
      menuPrice: '12000',
      storeName: '울엄 김치찜ㅇㄴㅁㅇㅁㄴㅇㅁ',
      category: 'KOREAN',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 2,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'KOREAN',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 11123,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'KOREAN',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 1111,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'KOREAN',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 2222,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'JAPANESE',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 2223,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'JAPANESE',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 2225,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'JAPANESE',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 33312,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'CHINESE',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 33313,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'WESTERN',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
    {
      postId: 3331,
      menuPrice: '12000',
      storeName: '울엄 김치찜',
      category: 'WESTERN',
      postMainMenu: '김치찜',
      postImage: { id: 23, url: '/images/mock-food.png' },
      postContent: 'string',
      createDate: '2024-07-08',
      updateDate: '2024-07-08',
      auto: true,
    },
  ];
}

function getMockPostPossiblePatch() {
  return {
    id: 111,
    writer: 'zxc',
    postMainMenu: 'string',
    postImage: 'string',
    postContent: '호박고구마'.repeat(150),
    createDate: '2024-07-08',
    updateDate: '2024-07-08',
    auto: true,
  };
}

function getMockPostNotPossiblePatch() {
  return {
    id: 111,
    writer: 'other',
    postMainMenu: 'string',
    postImage: 'string',
    postContent: '호박고구마'.repeat(150),
    createDate: '2024-07-08',
    updateDate: '2024-07-08',
    auto: true,
  };
}

function getFollowings() {
  return [
    {
      memberId: 1,
      username: '김철수',
      memberImageUrl: 'profile/profile-default-icon-female.svg',
      each: true,
      isLive: true,
    },
    {
      memberId: 2,
      username: '신짱구',
      memberImageUrl: null,
      each: true,
      isLive: true,
    },
    {
      memberId: 3,
      username: '이유리',
      memberImageUrl: 'profile/profile-default-icon-female.svg',
      each: true,
      isLive: false,
    },
    {
      memberId: 4,
      username: '훈이',
      memberImageUrl: 'profile/profile-default-icon-female.svg',
      each: true,
      isLive: true,
    },
    {
      memberId: 5,
      username: '맹구',
      memberImageUrl: null,
      each: true,
      isLive: false,
    },
  ];
}

function getMockPostsOfStroe() {
  return [
    {
      postId: 1,
      memberUsername: '신짱구',
      storeName: '김치찜',
      postMainMenu: '김치',
      menuImage: {
        id: 1,
        url: '/images/mock-food.png',
      },
      menuPrice: 1,
      createdDate: '2024-07-25T14:40:32.916Z',
      updatedDate: '2024-07-25T14:40:32.916Z',
      category: 'KOREAN',
    },
    {
      postId: 2,
      memberUsername: '신짱구',
      storeName: '김치찜',
      postMainMenu: '김치',
      menuImage: {
        id: 1,
        url: '/images/mock-food.png',
      },
      menuPrice: 1,
      createdDate: '2024-07-25T14:40:32.916Z',
      updatedDate: '2024-07-25T14:40:32.916Z',
      category: 'KOREAN',
    },
    {
      postId: 3,
      memberUsername: '신짱구',
      storeName: '김치찜',
      postMainMenu: '김치',
      menuImage: {
        id: 1,
        url: '/images/mock-food.png',
      },
      menuPrice: 1,
      createdDate: '2024-07-25T14:40:32.916Z',
      updatedDate: '2024-07-25T14:40:32.916Z',
      category: 'KOREAN',
    },
    {
      postId: 4,
      memberUsername: '신짱구',
      storeName: '김치찜',
      postMainMenu: '김치',
      menuImage: {
        id: 1,
        url: '/images/mock-food.png',
      },
      menuPrice: 1,
      createdDate: '2024-07-25T14:40:32.916Z',
      updatedDate: '2024-07-25T14:40:32.916Z',
      category: 'KOREAN',
    },
    {
      postId: 5,
      memberUsername: '신짱구',
      storeName: '김치찜',
      postMainMenu: '김치',
      menuImage: {
        id: 1,
        url: '/images/mock-food.png',
      },
      menuPrice: 1,
      createdDate: '2024-07-25T14:40:32.916Z',
      updatedDate: '2024-07-25T14:40:32.916Z',
      category: 'KOREAN',
    },
  ];
}
