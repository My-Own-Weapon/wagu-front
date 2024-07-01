import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/login', () => {
    console.log('mock Api : login sucess !!');

    return HttpResponse.json({ accessToken: '1234', status: 201 });
  }),

  http.post('/api/logout', () => {
    console.log('mock Api : 로그아웃 !!');

    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0',
      },
    });
  }),

  http.post('/api/users', async () => {
    console.log('mock Api : 회원가입 !!');
    /* 중복된 유저 */
    return HttpResponse.text(JSON.stringify('Already exists user'), {
      status: 403,
    });

    /* 성공 */
    // return HttpResponse.json({
    //   message: '성공',
    //   succ: true,
    // });
  }),

  http.get('/api/allPosts', () => {
    console.log('fetch all post !!');

    return HttpResponse.json(getMockPosts());
  }),
];

function getMockPosts() {
  return {
    friends: [
      {
        id: 1,
        userName: '김철수',
      },
      {
        id: 2,
        userName: '신짱구',
      },
      {
        id: 3,
        userName: '이유리',
      },
      {
        id: 4,
        userName: '훈이',
      },
    ],
    posts: [
      {
        id: 'post1',
        imgUrl: '@public/foodTestImg.png',
        storeName: '기숙사 식당',
      },
      {
        id: 'post2',
        imgUrl: '@public/foodTestImg.png',
        storeName: '정담 순댓국',
      },
      {
        id: 'post3',
        imgUrl: '@public/foodTestImg.png',
        storeName: '경슐랭',
      },
      {
        id: 'post4',
        imgUrl: '@public/foodTestImg.png',
        storeName: '숑숑돈까스',
      },
      {
        id: 'post5',
        imgUrl: '@public/foodTestImg.png',
        storeName: '마라마라탕',
      },
    ],
  };
}
