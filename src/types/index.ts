import React from 'react';

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
  postId: number;
  postMainMenu: string;
  storeName: string;
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

export interface StoreResponse {
  storeId: number;
  storeName: string;
  address: string;
  posx: number;
  posy: number;
  liveStore: boolean;
}

export interface VotedStoreResponse {
  storeId: number;
  storeName: string;
  menuImage: {
    id: number;
    url: string;
  };
  postCount: number;
  menuName: string;
}

export interface LoginFormInputs {
  username: string;
  password: string;
}

export interface Category {
  id: string;
  name: CategoriesWithAllEN;
  IconSVG: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ReviewFormValues {
  menuReviews: {
    menuName: string;
    menuPrice: string;
    menuContent: string;
    image?: File | null;
  }[];
}

export interface MenuReviewInfo {
  menuName: string;
  menuPrice: string;
  menuContent: string;
}

export interface ReviewRequestSchema {
  postCategory: string;
  storeName: string;
  storeLocation: Omit<AddressSearchDetails, 'storeName'>;
  menus: MenuReviewInfo[];
  postMainMenu: string;
  permission: 'PRIVATE' | 'PUBLIC';
  auto: boolean;
}

export interface Friend {
  profileImage: string;
  sessionId: string;
  userName: string;
  address: string;
  storeName: string;
}

// declare global {
//   interface Window {
//     kakao: any;
//   }
// }

/* for Kakao api does not provide types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MapMarker = any;
export type KakaoMapElement = HTMLDivElement;
