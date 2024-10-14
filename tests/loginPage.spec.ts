import { test, expect } from '@playwright/test';
import LoginPageModel from './pageModel/LoginPageModel';
import { baseUrl } from './constants';

test.describe('login page test', () => {
  test('login page element들이 render되는지 확인한다.', async ({ page }) => {
    const I = new LoginPageModel(page);

    await I.goto();

    await expect(I.userNameInput).toBeVisible();
    await expect(I.passwordInput).toBeVisible();
    await expect(I.submitButton).toBeVisible();
    await expect(I.signupLink).toBeVisible();
  });

  test('정상적인 아이디와 비밀번호를 입력하면 로그인이 성공하고 메인페이지로 이동한다.', async ({
    page,
  }) => {
    const I = new LoginPageModel(page);
    await I.goto();

    // given
    await I.userNameInput.fill('test');
    await I.passwordInput.fill('test');

    // when
    await I.submitButton.click();

    // then
    await expect(page).toHaveURL(`${baseUrl}`);
  });

  test('잘못된 아이디와 비밀번호를 입력하면 에러 메세지가 표시된다.', async ({
    page,
  }) => {
    const I = new LoginPageModel(page);
    await I.goto();

    // given
    await I.userNameInput.fill('wrongusername');
    await I.passwordInput.fill('wrongpassword');

    // when
    await I.submitButton.click();

    // then
    await expect(
      page.locator('[role=alert]', {
        hasText: '일치하지',
      }),
    ).toBeVisible();
  });

  test('회원가입 링크를 클릭하면 회원가입 페이지로 이동한다.', async ({
    page,
  }) => {
    const I = new LoginPageModel(page);
    await I.goto();

    // when
    await I.signupLink.click();

    // then
    await expect(page).toHaveURL(`${baseUrl}/signup`);
  });
});
