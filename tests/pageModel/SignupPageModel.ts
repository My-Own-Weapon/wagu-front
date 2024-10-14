import { Locator, Page } from '@playwright/test';

export default class SignupPageModel {
  private readonly BASE_URL =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';

  private readonly $userNameInput: Locator;

  private readonly $passwordInput: Locator;

  private readonly $passwordConfirmInput: Locator;

  private readonly $nameInput: Locator;

  private readonly $phoneNumberInput: Locator;

  private readonly $signupButton: Locator;

  private readonly $loginLink: Locator;

  constructor(public readonly page: Page) {
    this.$userNameInput = this.page.getByRole('textbox', { name: '아이디' });
    this.$passwordInput = this.page.getByRole('textbox', {
      name: '비밀번호',
      exact: true,
    });
    this.$passwordConfirmInput = this.page.getByRole('textbox', {
      name: '비밀번호 확인',
      exact: true,
    });
    this.$nameInput = this.page.getByRole('textbox', { name: '이름' });
    this.$phoneNumberInput = this.page.getByRole('textbox', {
      name: '휴대폰 번호',
    });
    this.$signupButton = this.page.getByRole('button', { name: '회원가입' });
    this.$loginLink = this.page.getByRole('link', { name: '로그인' });
  }

  async goto() {
    await this.page.goto(`${this.BASE_URL}/signup`);
  }

  get userNameInput() {
    return this.$userNameInput;
  }

  get passwordInput() {
    return this.$passwordInput;
  }

  get passwordConfirmInput() {
    return this.$passwordConfirmInput;
  }

  get nameInput() {
    return this.$nameInput;
  }

  get phoneNumberInput() {
    return this.$phoneNumberInput;
  }

  get signupButton() {
    return this.$signupButton;
  }

  get loginLink() {
    return this.$loginLink;
  }

  async fillSignupForm({
    username,
    password,
    passwordConfirm,
    name,
    phoneNumber,
  }: {
    username: string;
    password: string;
    passwordConfirm: string;
    name: string;
    phoneNumber: string;
  }) {
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.passwordConfirmInput.fill(passwordConfirm);
    await this.nameInput.fill(name);
    await this.phoneNumberInput.fill(phoneNumber);
  }
}
