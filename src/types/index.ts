import { categoryMap } from '../constants/categoty';

export interface LoginUserInputs {
  username: string;
  password: string;
}

export interface SignupDetails {
  username: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phoneNumber: string;
}

export interface AddPostProps {
  postMainMenu: 'string';
  postImage: 'string';
  postContent: 'string';
  storeName: 'string';
  storeLocation: {
    address: 'string';
    posx: 0;
    posy: 0;
  };
  menus: [
    {
      menuName: 'string';
      menuPrice: 0;
      categoryName: 'string';
    },
  ];
  auto: true;
}

export interface PostOfStoreResponse {
  storeName: string;
  postId: number;
  postMainMenu: string;
  category: CategoriesEN;
  menuImage: PostImage;
  menuPrice: number;
  memberUsername: string;
  createdDate: string;
}

export interface PostImage {
  id: string;
  url: string;
}

export interface AddressSearchDetails {
  address: string;
  storeName: string;
  posx: string;
  posy: string;
}

/**
 *  left, right: x-axis
 *  up, down: y-axis
 */
export interface MapVertexes {
  left: number;
  right: number;
  up: number;
  down: number;
}

export interface ProfileWithoutFollowResponse {
  memberId: number;
  imageUrl: string;
  username: string;
  name: string;
}

export type CategoriesKR = (typeof categoryMap)[keyof typeof categoryMap];
export type CategoriesEN = keyof typeof categoryMap;
export type CategoriesWithAllEN = CategoriesEN | 'ALL';
export type CategoriesWithAllKR = CategoriesKR | '전부';
