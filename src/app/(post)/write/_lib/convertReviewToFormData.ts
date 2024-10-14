import {
  AddressSearchDetails,
  CategoriesEN,
  ReviewFormValues,
  ReviewRequestSchema,
} from '@/types';

interface Props {
  selectedCategory: CategoriesEN | null;
  addressSearchResult: AddressSearchDetails;
  data: ReviewFormValues;
  menuReviews: ReviewFormValues['menuReviews'];
}

const convertReviewToFormData = ({
  selectedCategory,
  addressSearchResult,
  data,
  menuReviews,
}: Props): FormData | Error => {
  if (!selectedCategory) {
    return new Error('카테고리를 선택해주세요 !');
  }

  if (!menuReviews.every(({ menuName }) => !!menuName)) {
    return new Error('메뉴 정보를 모두 입력해주세요 !');
  }

  const formData = new FormData();
  const { storeName, address, posx, posy } = addressSearchResult;
  const reviewData = {
    postMainMenu: data.menuReviews[0].menuName,
    postCategory: selectedCategory,
    storeName,
    storeLocation: {
      address,
      posx,
      posy,
    },
    menus: data.menuReviews.map(({ menuName, menuPrice, menuContent }) => ({
      menuName,
      menuPrice,
      menuContent,
    })),
    permission: 'PUBLIC',
    auto: false,
  } as ReviewRequestSchema;

  data.menuReviews
    .map(({ image }) => image)
    .forEach((image) => {
      if (!image) return;

      formData.append('images', image);
    });
  formData.append(
    'data',
    new Blob([JSON.stringify(reviewData)], {
      type: 'application/json',
    }),
  );

  return formData;
};

export default convertReviewToFormData;
