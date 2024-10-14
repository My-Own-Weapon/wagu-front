import { PostDetailsResponse } from '@/app/(post)/posts/[postId]/page';

/**
 * @description 로그인한 사용자가 작성한 글의 상세 정보
 */
const modifiablePost = {
  postId: 100,
  memberUsername: '수정가능 엄준식',
  storeName: '문희네 고구마',
  storeLocation: {
    address: '서울특별시 강남구 역삼동 123-456',
    posx: '31.123456',
    posy: '127.123456',
  },
  postMainMenu: '호박 고구마',
  postCategory: 'KOREAN',
  menus: [
    {
      menuId: '1',
      menuImage: {
        id: '01',
        url: '/images/mock-food.png',
      },
      menuName: '호박고구마 1번',
      menuPrice: '3000',
      menuContent: '어머니 호박고구마요'.repeat(30),
    },
    {
      menuId: '2',
      menuImage: {
        id: '02',
        url: 'pulbic/images/mock-food.png',
      },
      menuName: '호박고구마 2번',
      menuPrice: '3000',
      menuContent: '오~케이 !'.repeat(30),
    },
    {
      menuId: '3',
      menuImage: {
        id: '03',
        url: 'pulbic/images/mock-food.png',
      },
      menuName: '호박고구마 3번',
      menuPrice: '3000',
      menuContent: '음하음하아아하하하 음하하하핫'.repeat(30),
    },
  ],
  permission: 'PRIVATE',
  auto: true,
  finished: true,
} satisfies PostDetailsResponse;

const notModifiablePost = {
  postId: 100,
  memberUsername: '수정 불가능 엄준식',
  storeName: '문희네 고구마',
  storeLocation: {
    address: '서울특별시 강남구 역삼동 123-456',
    posx: '31.123456',
    posy: '127.123456',
  },
  postMainMenu: '호박 고구마',
  postCategory: 'KOREAN',
  menus: [
    {
      menuId: '1',
      menuImage: {
        id: '01',
        url: '/images/mock-food.png',
      },
      menuName: '호박고구마 1번',
      menuPrice: '3000',
      menuContent: '어머니 호박고구마요'.repeat(30),
    },
    {
      menuId: '2',
      menuImage: {
        id: '02',
        url: 'pulbic/images/mock-food.png',
      },
      menuName: '호박고구마 2번',
      menuPrice: '3000',
      menuContent: '오~케이 !'.repeat(30),
    },
    {
      menuId: '3',
      menuImage: {
        id: '03',
        url: 'pulbic/images/mock-food.png',
      },
      menuName: '호박고구마 3번',
      menuPrice: '3000',
      menuContent: '음하음하아아하하하 음하하하핫'.repeat(30),
    },
  ],
  permission: 'PRIVATE',
  auto: true,
  finished: true,
};

export { modifiablePost, notModifiablePost };
