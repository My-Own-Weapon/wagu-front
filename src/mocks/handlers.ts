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

    // return HttpResponse.json({
    //     headers: {
    //       status: 200,
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

  http.get('/api/liveFriends', () => {
    console.log('fetch live friends !!');

    return HttpResponse.json(getLiveFriends());
  }),
];

function getMockPosts() {
  return {
    liveFollows: [
      {
        id: 'follow1',
        userName: '김철수',
      },
      {
        id: 'follow2',
        userName: '신짱구',
      },
      {
        id: 'follow3',
        userName: '이유리',
      },
      {
        id: 'follow4',
        userName: '훈이',
      },
    ],
    posts: [
      {
        postMainMenu: '초콜렛 김밥',
        postImage: '/public/wagu-logo.svg',
        postContent:
          '음층마싯게요음층마싯게요음층마싯게요음층마싯게요음층마싯게요음층마싯게요음층마싯게요음층마싯게요',
        storeName: '',
        storeLocation: {
          address: '서울 강남구',
          posx: 0,
          posy: 0,
        },
        menus: [
          {
            menuName: '송이버섯',
            menuPrice: 0,
            categoryName: '한식',
          },
        ],
        auto: true,
      },
    ],
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
