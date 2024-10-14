'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AddressSearchDetails, CategoriesEN } from '@/types';
import { BoxButton, Spacing, Container, Stack } from '@/components/ui';
import {
  AddressSearchSection,
  CategorySelectSection,
  ImageInputSection,
  ReviewInputsSection,
  ReviewPageNavigation,
  Spinner,
} from '@/app/(post)/write/_components';
import {
  usePageIndexControl,
  useWritePageFormControl,
} from '@/app/(post)/write/_hooks';

import dynamic from 'next/dynamic';

import s from './page.module.scss';

const DevTool = dynamic(
  () => import('@hookform/devtools').then((mod) => mod.DevTool),
  { ssr: false },
);

export default function WritePage() {
  const {
    control,
    handleSubmit,
    watch,
    isSubmitting,
    isValid,
    setValue,
    fields,
    append,
    remove,
    onReviewSubmit,
    menuReviews,
  } = useWritePageFormControl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
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

  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [isSubmitting]);

  const {
    handleAddReview,
    handleDeleteReview,
    handleNextPage,
    handlePrevPage,
  } = usePageIndexControl({
    currentPageIdx,
    setCurrentPageIdx,
    reviewFieldLength: fields.length,
    append,
    remove,
  });

  return (
    <>
      {isLoading && <Spinner />}
      <Container as="main" backgroundColor="#f5f6f8">
        <Stack padding="0 24px">
          <Spacing size={16} />
          <form
            onSubmit={handleSubmit(async (data) => {
              return onReviewSubmit({
                data,
                selectedCategory,
                addressSearchResult,
                menuReviews,
                router,
              });
            })}
          >
            <Stack>
              <AddressSearchSection
                addressSearchResult={addressSearchResult}
                onAddressSelect={setAddressSearchResult}
              />
              <Spacing size={20} />
              <CategorySelectSection
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <Spacing size={20} />
              <ImageInputSection
                control={control}
                currentPageIdx={currentPageIdx}
                menuReviews={menuReviews}
              />
              <Spacing size={20} />
              <ReviewInputsSection
                key={currentPageIdx}
                control={control}
                watch={watch}
                setValue={setValue}
                currentPageIdx={currentPageIdx}
                selectedCategory={selectedCategory}
                setIsLoading={setIsLoading}
              />
              <Spacing size={20} />
            </Stack>
            <nav className={s.writeNavBar}>
              <BoxButton
                height="48px"
                styleType="outline"
                type="button"
                onClick={handleAddReview}
              >
                메뉴 추가
              </BoxButton>
              <BoxButton
                height="48px"
                styleType="fill"
                type="submit"
                disabled={!isValid}
              >
                포스트 등록
              </BoxButton>
            </nav>
          </form>
          <ReviewPageNavigation
            currentPageIdx={currentPageIdx}
            totalPageCount={fields.length}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handleDeleteAdditionalMenu={handleDeleteReview}
          />
          <Spacing size={96} />
        </Stack>
        {process.env.NODE_ENV === 'development' && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <DevTool control={control as any} />
        )}
      </Container>
    </>
  );
}
