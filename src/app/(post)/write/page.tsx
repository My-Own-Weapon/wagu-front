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
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { apiService } from '@services/apiService';
import InputBox from '@/components/ui/InputBox';
import ImageFill from '@/components/ui/ImageFill';
import Button from '@/components/ui/Button';
import AddressInput from '@/components/AddressInput';
import { AddressSearchDetails, CategoriesEN } from '@/types';
import Heading from '@/components/ui/Heading';
import CategorySelect from '@/app/(post)/write/_component/CategorySelect';
import Spinner from '@/app/(post)/write/_component/Spinnner';

import s from './page.module.scss';

interface AIAutoReviewResponse {
  menuContent: string;
}

interface UseFetchAIAutoReviewProps {
  category: CategoriesEN;
  menuName: string;
}

const useFetchAIAutoReview = () => {
  return useMutation<AIAutoReviewResponse, Error, UseFetchAIAutoReviewProps>({
    mutationFn: ({ category, menuName }) => {
      return apiService.fetchAIAutoReview({ category, menuName });
    },
  });
};

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

type PageStates = Record<number, PageState>;

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
  const [selectedCategory, setSelectedCategory] = useState<CategoriesEN | null>(
    null,
  );
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Define the mutation using useMutation hook
  const {
    mutate: fetchAIAutoReview,
    data: autoReviewData,
    isPending,
  } = useFetchAIAutoReview();

  const handleFetchAIAutoReview = () => {
    if (selectedCategory) {
      fetchAIAutoReview({
        category: selectedCategory,
        menuName: pageStates[1].menuName,
      });
    }
  };

  useEffect(() => {
    if (autoReviewData) {
      setPageStates((prevStates) => ({
        ...prevStates,
        1: {
          ...prevStates[1],
          menuContent: autoReviewData.menuContent,
        },
      }));
    }
  }, [autoReviewData]);

  useEffect(() => {
    document.forms[0].addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  });

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
      postCategory: selectedCategory,
      storeName,
      storeLocation: {
        address,
        posx,
        posy,
      },
      permission: 'PUBLIC',
      auto: 'false',
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
      {isPending && <Spinner />}
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
          <Wrapper gap={addressSearchResult.address ? '16px' : '12px'}>
            <Heading
              title="식당 정보"
              as="h3"
              fontWeight="semiBold"
              fontSize="16px"
            />
            {!!addressSearchResult.address &&
              !!addressSearchResult.storeName && (
                <div className={s.storeDetails}>
                  <p className={s.storeName}>{addressSearchResult.address}</p>
                  <p className={s.storeAddress}>
                    {addressSearchResult.storeName}
                  </p>
                </div>
              )}
            <AddressInput
              value={addressSearchResult.storeName || ''}
              onSelect={handleAddressSelect}
            />
          </Wrapper>
          <Wrapper gap="16px">
            <Heading
              title="카테고리 선택"
              as="h3"
              fontWeight="semiBold"
              fontSize="16px"
            />
            <CategorySelect
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </Wrapper>

          <Wrapper gap="16px">
            <Heading
              title="이미지"
              as="h3"
              fontWeight="semiBold"
              fontSize="16px"
            />
            <div className={s.imgs}>
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
              <InputBox
                width="80px"
                height="80px"
                label="이미지 추가"
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
            </div>
          </Wrapper>
          <Wrapper gap="16px">
            <Heading
              title="메뉴 1"
              as="h3"
              fontWeight="semiBold"
              fontSize="16px"
            />
            <div
              style={{
                width: '100%',

                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
              }}
            >
              <InputBox
                height="30px"
                label="대표 메뉴"
                name="menuName"
                placeholder="대표 메뉴를 입력해주세요"
                type="text"
                value={currentState.menuName}
                onChange={handleChange}
              />
              {/* ✅ TODO: 세자리수마다 , 붙이기 */}
              <InputBox
                height="30px"
                label="가격"
                name="menuPrice"
                placeholder="메뉴 가격을 입력해주세요"
                type="number"
                value={currentState.menuPrice}
                onChange={handleChange}
              />
              <div className={s.reviewWrapper}>
                <button
                  className={s.AIBtn}
                  type="button"
                  onClick={handleFetchAIAutoReview}
                >
                  리뷰 자동 완성
                </button>
                <InputBox
                  height="200px"
                  label="리뷰"
                  name="menuContent"
                  placeholder="리뷰를 입력해주세요 !"
                  type="textarea"
                  value={currentState.menuContent}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Wrapper>
          <nav className={s.writeNavBar}>
            <button
              className={s.addMenuBtn}
              type="button"
              onClick={handleAddReview}
            >
              메뉴 추가
            </button>
            <button className={s.submitBtn} type="submit">
              포스트 등록
            </button>
          </nav>
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

function Wrapper({
  gap,
  children,
}: {
  gap: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '16px',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap,
      }}
    >
      {children}
    </div>
  );
}
