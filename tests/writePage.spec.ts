import test, { expect } from '@playwright/test';
import { baseUrl } from './constants';
import WritePageModel from './pageModel/WritePageModel';
import { delay } from '@/utils';

test.describe('글쓰기 page 테스트', () => {
  let I: WritePageModel;

  test.beforeEach(async ({ page }) => {
    I = new WritePageModel(page);
  });

  test('리뷰 작성 성공 시나리오', async ({ page }) => {
    // 1. 페이지로 이동
    await I.gotoWritePage();

    // 2. 식당 정보 입력 (AddressInput 컴포넌트)
    await I.addressSearchTrigger.click();
    await I.addressInput.fill('스타벅스');
    await page.keyboard.press('Enter');

    const addressSearchResults = page.getByTestId('address-search-results');
    await expect(addressSearchResults).toBeVisible();
    await addressSearchResults.first().click();
    await expect(addressSearchResults).not.toBeVisible();

    /**
     * ✅ TODO: 식당 정보 클릭시 클릭된 식당 정보가 표시되는지 확인
     */

    // 3. 카테고리 선택 (CategorySelect 컴포넌트)
    await I.categorySelectTrigger.click();
    await page.getByText('카페').click();

    // 4. 이미지 추가 (ImageInput 컴포넌트)
    const filePath = 'public/images/mock-food.png';
    await page.setInputFiles('input[type="file"]', filePath);

    // 5. 대표 메뉴 입력
    await I.menuNameInput.fill('아메리카노');

    // 6. 가격 입력
    await I.menuPriceInput.fill('5000');

    // 7. 리뷰 입력
    await I.reviewInput.fill('JWT 아 JMT인가 ㅎ.');

    // 8. 포스트 등록 버튼 클릭
    await I.submitButton.click();

    // 9. 등록 완료 확인 (API 응답 확인)
    await expect(page).toHaveURL(`${baseUrl}/`);
  });

  test('리뷰 작성 실패 시나리오 (식당 주소를 입력하지 않은 경우)', async ({
    page,
  }) => {
    // 1. 페이지로 이동
    await I.gotoWritePage();

    // 2. 식당 정보를 입력하지 않습니다.

    // 3. 카테고리 선택 (CategorySelect 컴포넌트)
    await I.categorySelectTrigger.click();
    await page.getByText('카페').click();

    // 4. 이미지 추가 (ImageInput 컴포넌트)
    const filePath = 'public/images/mock-food.png';
    await page.setInputFiles('input[type="file"]', filePath);

    // 5. 대표 메뉴 입력
    await I.menuNameInput.fill('아메리카노');

    // 6. 가격 입력
    await I.menuPriceInput.fill('5000');

    // 7. 리뷰 입력
    await I.reviewInput.fill('JWT 아 JMT인가 ㅎ.');

    // 8. 포스트 등록 버튼 클릭 및 dialog 대기
    const [dialog] = await Promise.all([
      page.waitForEvent('dialog'),
      I.submitButton.click(),
    ]);

    // dialog 메시지 확인
    expect(dialog.message()).toContain('리뷰 입력란을 모두 채워주세요');

    // dialog 닫기
    await dialog.accept();

    // 페이지는 이동하지 않습니다.
    await expect(page).toHaveURL(`${baseUrl}/write`);
  });
});
