export const categoryMap = {
  KOREAN: '한식',
  JAPANESE: '일식',
  CHINESE: '중식',
  FASTFOOD: '분식',
  WESTERN: '양식',
  CAFE: '카페',
  DESSERT: '디저트',
} as const;

export const categoryMapWithAll = {
  ALL: '전부',
  ...categoryMap,
} as const;
