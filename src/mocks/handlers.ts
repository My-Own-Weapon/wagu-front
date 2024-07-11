/* eslint-disable no-console */
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/login', () => {
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

  http.post('/api/logout', () => {
    console.log('mock Api : 로그아웃 !!');

    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0',
      },
    });
  }),

  http.post('/api/join', async () => {
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

  http.get('/api/posts', () => {
    console.log('fetch all post !!');

    return HttpResponse.json(getMockPosts());
  }),

  http.get('/api/posts/:postId', ({ request }) => {
    console.log('fetch post !!');

    const splitedUrl = request.url.split('/');
    const path = Number(splitedUrl[splitedUrl.length - 1]);

    if (path % 2 === 0) return HttpResponse.json(getMockPostPossiblePatch());

    return HttpResponse.json(getMockPostNotPossiblePatch());
  }),

  http.get('/api/liveFriends', () => {
    console.log('fetch live friends !!');

    return HttpResponse.json(getLiveFriends());
  }),
];

function getMockPosts() {
  return [
    {
      id: 1,
      category: 'KOREAN',
      postMainMenu: 'KOREAN',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 2,
      category: 'KOREAN',
      postMainMenu: 'KOREAN',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 11123,
      category: 'KOREAN',
      postMainMenu: 'KOREAN',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 1111,
      category: 'KOREAN',
      postMainMenu: 'KOREAN',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 2222,
      category: 'JAPANESE',
      postMainMenu: 'JAPANESE',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 2223,
      category: 'JAPANESE',
      postMainMenu: 'JAPANESE',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 2225,
      category: 'JAPANESE',
      postMainMenu: 'JAPANESE',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 3331,
      category: 'CHINESE',
      postMainMenu: 'CHINESE',
      postImage: 'string',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 4443,
      category: 'WESTERN',
      postMainMenu: 'WESTERN',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
      auto: true,
    },
    {
      id: 4442,
      category: 'WESTERN',
      postMainMenu: 'WESTERN',
      postContent: 'string',
      createDate: '2024-07-08T15:50:59.563Z',
      updateDate: '2024-07-08T15:50:59.563Z',
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
    createDate: '2024-07-08T15:50:59.563Z',
    updateDate: '2024-07-08T15:50:59.563Z',
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
    createDate: '2024-07-08T15:50:59.563Z',
    updateDate: '2024-07-08T15:50:59.563Z',
    auto: true,
  };
}

function getLiveFriends() {
  return [
    {
      memberId: 1,
      username: '김철수',
      each: true,
    },
    {
      memberId: 2,
      username: '신짱구',
      each: true,
    },
    {
      memberId: 3,
      username: '이유리',
      each: true,
    },
    {
      memberId: 4,
      username: '훈이',
      each: true,
    },
  ];
}
