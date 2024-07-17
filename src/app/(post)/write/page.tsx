'use client';

import React, {
  ChangeEvent,
  MouseEventHandler,
  ChangeEventHandler,
  FormEventHandler,
  useRef,
  useState,
  useEffect,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { apiService } from '@services/apiService';
import { CategoriesKR } from '@/app/page';
import InputBox from '@/components/ui/InputBox';
import ImageFill from '@/components/ui/ImageFill';
import Button from '@/components/ui/Button';
import CategoryList from '@/components/CategoryList';
import AddressInput, { AddressSearchDetails } from '@/components/AddressInput';

import s from './page.module.scss';

interface RequsetSchema {
  postCategory: string;
  storeName: string;
  storeLocation: {
    address: string;
    posx: string;
    posy: string;
  };
  menus: {
    menuName: string;
    menuPrice: string;
    menuContent: string;
  }[];
  postMainMenu: string;
  permission: 'PRIVATE' | 'PUBLIC';
  auto: 'true' | 'false';
}

interface PageState {
  postCategory?: string;
  menuName: string;
  menuPrice: string;
  menuContent: string;
  image?: File | null;
}

type WritePageCategoriesKR = Exclude<CategoriesKR, '전부'>;

type PageStates = Record<number, PageState>;

const categoryMap = {
  전부: 'ALL',
  한식: 'KOREAN',
  일식: 'JAPANESE',
  중식: 'CHINESE',
  분식: 'FASTFOOD',
  양식: 'WESTERN',
  카페: 'CAFE',
  디저트: 'DESSERT',
} as const;

export default function BoardPage() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [reviewCount, setReviewCount] = useState<number>(1);
  const [pageStates, setPageStates] = useState<PageStates>({
    1: getMainReviewPageState(),
    2: getAdditionalReviewPageState(),
    3: getAdditionalReviewPageState(),
  });
  const [addressSearchResult, setAddressSearchResult] =
    useState<AddressSearchDetails>({
      address: '',
      storeName: '',
      posx: '',
      posy: '',
    });
  const path = usePathname();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    document.forms[0].addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  });

  const [selectedCategory, setSelectedCategory] =
    useState<WritePageCategoriesKR | null>(null);

  const handleCategoryClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    setSelectedCategory(
      e.currentTarget.dataset.category as WritePageCategoriesKR,
    );
  };

  const handleAddReview: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    setReviewCount((prevCount) => prevCount + 1);
    setPageNumber((prev) => Math.min(prev + 1, reviewCount + 1));
  };

  const handleDeleteAdditionalMenu: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setReviewCount((prevCount) => prevCount - 1);
    setPageNumber((prev) => Math.min(prev, reviewCount));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    e.stopPropagation();

    const { name, value } = e.target;
    setPageStates((prevStates) => ({
      ...prevStates,
      [pageNumber]: {
        ...prevStates[pageNumber],
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const file = e.target.files ? e.target.files[0] : null;
    setPageStates((prevStates) => ({
      ...prevStates,
      [pageNumber]: {
        ...prevStates[pageNumber],
        image: file,
      },
    }));
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요 !');
      return;
    }

    const { menuName } = pageStates[1]!;
    const { storeName, address, posx, posy } = addressSearchResult;
    const formObj: RequsetSchema = {
      postMainMenu: menuName,
      postCategory: categoryMap[selectedCategory],
      storeName,
      storeLocation: {
        address,
        posx,
        posy,
      },
      permission: 'PUBLIC',
      auto: 'true',
      menus: [],
    };

    const formData = new FormData();

    Array.from({ length: reviewCount }, (_, i) => i + 1).forEach((v) => {
      const currentState = pageStates[v];

      if (currentState.image) {
        formData.append('images', currentState.image);
      }

      formObj.menus.push({
        menuName: currentState.menuName,
        menuPrice: currentState.menuPrice,
        menuContent: currentState.menuContent,
      });
    });

    const objString = JSON.stringify(formObj);
    const blobObj = new Blob([objString], { type: 'application/json' });

    formData.append('data', blobObj);

    try {
      await apiService.addPost(formData);
      alert('포스트 작성 완료 !');
      router.push('/');
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  const handleAddressSelect = (addressDetails: AddressSearchDetails) => {
    setAddressSearchResult(addressDetails);
  };

  const currentState = pageStates[pageNumber];

  return (
    <main className={s.container}>
      <div className={s.wrapper}>
        {pageNumber > 1 && (
          <button
            className={s.pageControlBtn}
            type="button"
            onClick={handlePrevPage}
          >
            👈
          </button>
        )}
        <form className={s.formContainer} onSubmit={handleSubmit} ref={formRef}>
          <div className={s.imageArea}>
            <InputBox
              width="80px"
              height="80px"
              name="menu"
              placeholder="+"
              accept="image/*"
              type="file"
              onChange={
                handleFileChange as ChangeEventHandler<
                  HTMLInputElement | HTMLTextAreaElement
                >
              }
            />
            {currentState.image && (
              <ImageFill
                width="80px"
                height="80px"
                fill
                src={URL.createObjectURL(currentState.image)}
                alt="preview"
                borderRadius="8px"
              />
            )}
          </div>
          {pageNumber === 1 && (
            <>
              <CategoryList
                heading="카테고리"
                path={path}
                selectedCategory={selectedCategory}
                onClick={handleCategoryClick}
              />
              <AddressInput
                title="·&nbsp;&nbsp;주소"
                value={addressSearchResult.address || ''}
                onSelect={handleAddressSelect}
              />
              <InputBox
                height="30px"
                label="·&nbsp;&nbsp;가게 이름"
                name="storeName"
                placeholder="가게 이름을 입력해주세요"
                type="text"
                value={addressSearchResult?.storeName || ''}
                onChange={handleChange}
              />
            </>
          )}
          <InputBox
            height="30px"
            label="·&nbsp;&nbsp;대표 메뉴"
            name="menuName"
            placeholder="대표 메뉴를 입력해주세요"
            type="text"
            value={currentState.menuName}
            onChange={handleChange}
          />
          <InputBox
            height="30px"
            label="·&nbsp;&nbsp;가격"
            name="menuPrice"
            placeholder="메뉴 가격을 입력해주세요"
            type="number"
            value={currentState.menuPrice}
            onChange={handleChange}
          />
          <InputBox
            height="200px"
            label="·&nbsp;&nbsp;리뷰"
            name="menuContent"
            placeholder="리뷰를 입력해주세요 !"
            type="textarea"
            value={currentState.menuContent}
            onChange={handleChange}
          />
          <div className={s.btnArea}>
            <Button
              width="100%"
              height="48px"
              text="메뉴 추가"
              type="button"
              onClick={handleAddReview}
            />
            <Button
              width="100%"
              height="48px"
              text="게시글 등록"
              type="submit"
            />
          </div>
        </form>
        {pageNumber > 1 && (
          <Button
            className={s.deleteAdditionalMenuBtn}
            width="auto"
            text="추가 메뉴 삭제"
            type="button"
            onClick={handleDeleteAdditionalMenu}
          />
        )}{' '}
        {((pageNumber < reviewCount && reviewCount > 1) ||
          reviewCount > pageNumber) && (
          <button
            className={s.pageControlBtn}
            type="button"
            onClick={handleNextPage}
          >
            👉
          </button>
        )}
      </div>
    </main>
  );
}

function getAdditionalReviewPageState(): PageState {
  return {
    menuName: '',
    menuPrice: '',
    menuContent: '',
    image: null,
  };
}

function getMainReviewPageState(): PageState {
  return {
    postCategory: '',
    menuName: '',
    menuPrice: '',
    menuContent: '',
    image: null,
  };
}
