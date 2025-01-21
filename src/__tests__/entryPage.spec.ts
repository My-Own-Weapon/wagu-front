import { test, expect } from '@playwright/test';

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://www.wagubook.shop'
    : 'http://localhost:3000';

test.describe('EntryPage 테스트', () => {
  test('회원가입 버튼을 클릭하면 회원가입 페이지로 이동한다.', async ({
    page,
  }) => {
    // when
    await page.goto(`${baseUrl}/entry`);
    await page.click('a[href="/signup"]');

    // then
    await expect(page).toHaveURL(`${baseUrl}/signup`);
  });

  test('로그인 버튼을 클릭하면 로그인 페이지로 이동한다.', async ({ page }) => {
    // when
    await page.goto(`${baseUrl}/entry`);
    await page.click('a[href="/login"]');

    // then
    await expect(page).toHaveURL(`${baseUrl}/login`);
  });
});
