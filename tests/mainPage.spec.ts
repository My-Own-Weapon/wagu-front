import { test, expect } from '@playwright/test';

test.describe('Main Page (HomePage)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('메인 페이지가 정상적으로 렌더링되는지 확인', async ({ page }) => {
    const liveFriendsHeading = page.getByText(/방송중인 친구가/);
    const myPostHeading = page.locator('text=My Post');
    const categoryList = page.getByTestId('category-list');
    const postCards = page.getByTestId('post-cards');

    await expect(liveFriendsHeading).toBeVisible();
    await expect(myPostHeading).toBeVisible();
    await expect(categoryList).toBeVisible();
    await expect(postCards).toBeVisible();
  });

  test('카테고리 클릭 시 포스트가 필터링되는지 확인', async ({ page }) => {
    await page.click('[data-category="CAFE"]');

    const noPostMessage = page.locator(
      'text=카테고리에 해당하는 포스트가 없어요!',
    );
    const filteredPostCards = page.locator('[data-testid="post-cards"]');

    await expect(noPostMessage).toBeVisible();
    await expect(filteredPostCards).not.toBeVisible();
  });

  test('방송중인 친구가 있을 때 또는 없을 때 올바른 메시지가 표시되는지 확인', async ({
    page,
  }) => {
    const liveFriendsMessage = page.getByText(/방송중인 친구가 있어요/);
    const noLiveFriendsMessage = page.getByText(/방송중인 친구가 없어요/);

    const isLiveFriendsVisible = await liveFriendsMessage.isVisible();
    const isNoLiveFriendsVisible = await noLiveFriendsMessage.isVisible();

    expect(isLiveFriendsVisible || isNoLiveFriendsVisible).toBe(true);
  });
});
