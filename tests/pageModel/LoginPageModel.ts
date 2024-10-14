import { Locator, Page } from '@playwright/test';
import { baseUrl } from '../constants';

export default class LoginPageModel {
  private readonly $userNameInput: Locator;

  private readonly $passwordInput: Locator;

  private readonly $submitButton: Locator;

  private readonly $signupLink: Locator;

  constructor(public readonly page: Page) {
    this.$userNameInput = this.page.getByRole('textbox', { name: '아이디' });
    this.$passwordInput = this.page.getByRole('textbox', { name: '비밀번호' });
    this.$submitButton = this.page.getByRole('button', { name: '로그인' });
    this.$signupLink = this.page.getByRole('link', { name: '회원가입' });
  }

  async goto() {
    await this.page.goto(`${baseUrl}/login`);
  }

  get userNameInput() {
    return this.$userNameInput;
  }

  get passwordInput() {
    return this.$passwordInput;
  }

  get submitButton() {
    return this.$submitButton;
  }

  get signupLink() {
    return this.$signupLink;
  }
}
