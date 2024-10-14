import test, { expect } from '@playwright/test';
import { baseUrl } from './constants';
import WritePageModel from './pageModel/WritePageModel';

test.describe('글쓰기 page 테스트', () => {
  // let writePageModel: WritePageModel;

  // test.beforeEach(async ({ page }) => {
  //   await page.goto(`${baseUrl}/write`);
  //   writePageModel = new WritePageModel(page);
  // });

  test('리뷰 작성 시나리오', async ({ page }) => {
    const I = new WritePageModel(page);

    // 1. 페이지로 이동
    await I.gotoWritePage();

    // 2. 식당 정보 입력 (AddressInput 컴포넌트)
    await page.click('input[name="address"]');
    await page.fill('input[name="address"]', '스타벅스');
    await page.keyboard.press('Enter');
    const addressSearchResults = page.locator(
      'ul[data-testId="address-search-results"]',
    );
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
    await page.fill('input[name="menuReviews.0.menuName"]', '아메리카노');

    // 6. 가격 입력
    await page.fill('input[name="menuReviews.0.menuPrice"]', '5000');

    // 7. 리뷰 입력
    await page.fill(
      'textarea[name="menuReviews.0.menuContent"]',
      'JWT 아 JMT인가 ㅎ.',
    );

    // 8. 포스트 등록 버튼 클릭
    await page.click('button[type="submit"]'); // 포스트 등록 버튼 클릭

    // 9. 등록 완료 확인 (API 응답 확인)
    await expect(page).toHaveURL(`${baseUrl}/`);
  });
});
