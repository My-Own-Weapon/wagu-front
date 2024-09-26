// signupPage.spec.ts
import { test, expect } from '@playwright/test';
import SignupPageModel from './pageModel/SignupPageModel';

test.describe('Signup Page', () => {
  test('회원가입 페이지의 input element들이 render되는지 확인한다.', async ({
    page,
  }) => {
    const I = new SignupPageModel(page);

    await I.goto();

    /* inputs */
    await expect(I.userNameInput).toBeVisible();
    await expect(I.passwordInput).toBeVisible();
    await expect(I.passwordConfirmInput).toBeVisible();
    await expect(I.nameInput).toBeVisible();
    await expect(I.phoneNumberInput).toBeVisible();

    /* buttons */
    await expect(I.signupButton).toBeVisible();
    await expect(I.loginLink).toBeVisible();
  });

  test('form 입력이 정상적일시에 login page로 넘어가게 된다.', async ({
    page,
  }) => {
    const I = new SignupPageModel(page);

    await I.goto();

    // given
    await I.fillSignupForm({
      username: 'test',
      password: 'test',
      passwordConfirm: 'test',
      name: '백현영',
      phoneNumber: '010-2899-8297',
    });

    // when
    await I.signupButton.click();

    // then
    await expect(page).toHaveURL(/.*login/);
  });

  test('모든 input field를 채우지 않는다면 회원가입 버튼은 비활성화된다.', async ({
    page,
  }) => {
    const I = new SignupPageModel(page);

    await I.goto();

    // given
    await I.fillSignupForm({
      username: 'test',
      password: 'test',
      passwordConfirm: 'test',
      name: '백현영',
      phoneNumber: '',
    });

    // when
    // then
    await expect(I.signupButton).toBeDisabled();
  });

  test('비밀번호 input과 비밀번호 확인 input의 값이 다르면 에러 메시지가 노출된다.', async ({
    page,
  }) => {
    const I = new SignupPageModel(page);

    await I.goto();

    // given
    await I.fillSignupForm({
      username: 'test',
      password: 'test',
      passwordConfirm: 'test2',
      name: '백현영',
      phoneNumber: '010-2899-8297',
    });

    // when
    // then
    await expect(
      page.locator('[role=alert]', {
        hasText: /일치하지 않습니다/i,
      }),
    ).toBeVisible();
  });

  test('하단의 로그인 링크를 클릭하면 로그인 페이지로 이동한다', async ({
    page,
  }) => {
    const I = new SignupPageModel(page);

    await I.goto();

    // given
    // when
    await I.loginLink.click();

    // then
    await expect(page).toHaveURL(/.*login/);
  });
});
