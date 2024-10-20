/* eslint-disable no-console */
import { Store } from '@/components/StoreCard';
import { User } from '@/components/UserCard';
import { delay, http, HttpResponse } from 'msw';

import fixtures from './fixtures';

export const handlers = [
  /* 로그인 */
  http.post('/login', async ({ request }) => {
    console.log('[POST] /login');

    const requestBody = await request.json();
    const { username, password } = requestBody as Record<string, string>;

    if (username === 'test' && password === 'test') {
      return HttpResponse.text('login 성공', {
        status: 200,
      });
    }

    return HttpResponse.json(
      {
        error: 'Not Authorized',
        message: '아이디와 비밀번호가 일치하지 않습니다.',
        status: 401,
      },
      { status: 401 },
    );
  }),

  /* 로그아웃 */
  http.post('/logout', () => {
    console.log('[POST] /logout');

    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0',
      },
    });
  }),

  /* 회원가입 */
  http.post('/join', async ({ request }) => {
    console.log('[POST] /join');

    const requestBody = await request.json();
    const { username, password, passwordConfirm, name, phoneNumber } =
      requestBody as Record<string, string>;

    if (username === 'conflict' && password === 'conflict') {
      return HttpResponse.json(
        {
          message: '이미 회원가입된 아이디입니다.',
        },
        {
          status: 409,
        },
      );
    }

    if (password !== passwordConfirm) {
      return HttpResponse.json(
        {
          message: '비밀번호가 일치하지 않습니다.',
        },
        {
          status: 400,
        },
      );
    }

    if (!name?.match(/^[가-힣]+$/g)) {
      return HttpResponse.json(
        {
          message: '이름은 한글만 입력 가능합니다.',
        },
        {
          status: 400,
        },
      );
    }

    if (!phoneNumber?.match(/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/)) {
      return HttpResponse.json(
        {
          message: '휴대폰 번호는 000-0000-0000 형식으로 입력해주세요.',
        },
        {
          status: 400,
        },
      );
    }

    if (username === 'test' && password === 'test') {
      return HttpResponse.text('회원가입 성공', {
        status: 200,
      });
    }

    return HttpResponse.json(
      {
        message: '정상적인 방법을 통해 회원가입을 진행하세요.',
      },
      {
        status: 401,
      },
    );
  }),

  http.get('/session', () => {
    console.log('[GET] /session');

    return HttpResponse.text('succ');
  }),

  http.get('rooms/followings', () => {
    console.log('[GET] /rooms/followings');

    return HttpResponse.json([
      {
        profileImage: '/profile/profile-default-icon-female.svg',
        sessionId: '1',
        userName: '임꺽정',
        address: 'string',
        storeName: 'string',
      },
    ]);
  }),

  /**
   * @description 로그인한 user가 작성한 모든 post 조회
   */
  http.get('/posts', async ({ request }) => {
    console.log('[GET] /posts');

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page'));
    const count = Number(url.searchParams.get('size'));

    return HttpResponse.json(fixtures.posts.slice(page, count));
  }),

  /**
   * @description post 작성
   * @see ApiService().addPost()
   */
  http.post('/posts', async ({ request }) => {
    console.log('[POST] /posts');

    /**
     * @description request.formData()로 formdata를 받아와야 했지만 msw 내부적으로 formData 파싱이 안되는
     * 이슈가 있어서 content-type을 확인해서 multipart/form-data인 경우에만 성공으로 처리
     */
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      return HttpResponse.text('success');
    }

    return HttpResponse.json(
      {
        message: '리뷰 입력란을 모두 채워주세요.',
      },
      {
        status: 400,
      },
    );
  }),

  /**
   * @description 단일 post 조회
   */
  http.get('/posts/:postId', ({ request }) => {
    console.log('[GET] /posts/:postId');

    const splitedUrl = request.url.split('/');
    const path = Number(splitedUrl[splitedUrl.length - 1]);

    if (path % 2 === 0) return HttpResponse.json(fixtures.modifiablePost);

    return HttpResponse.json(fixtures.notModifiablePost);
  }),

  /**
   * @description ai가 완성한 리뷰를 fetch한다.
   */
  http.post('/posts/auto', async ({ request }) => {
    console.log('[GET] /posts/auto');

    const body = (await request.json()) as {
      menuName: string;
      category: string;
    } | null;

    /* for spinner */
    await delay(1500);

    if (!body) {
      return HttpResponse.json(
        { error: 'Request body is missing' },
        { status: 400 },
      );
    }

    const { menuName } = body;
    return HttpResponse.json({
      menuContent: `나는로보트인데 ${menuName} 진짜 맛있음`,
    });
  }),

  http.get('/followings', () => {
    console.log('[GET] /followings');

    return HttpResponse.json(getFollowings());
  }),

  http.get('/members', ({ request }) => {
    console.log('[GET] /members');

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

  /**
   * @description user의 profile 정보를 조회한다.
   */
  http.get('/member/:userName/profile', ({ request }) => {
    console.log('[GET] /member/:userName/profile');

    const splitedUrl = request.url.split('/');
    const userName = splitedUrl[splitedUrl.length - 2];

    return HttpResponse.json({
      memberId: 1,
      imageUrl: '/profile/profile-default-icon-male.svg',
      username: userName,
      name: 'id',
    });
  }),

  /**
   * @description search page에서 가게 검색
   */
  http.get('/stores', ({ request }) => {
    console.log('[GET] /stores');

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
    console.log('[GET] /map/posts');

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
