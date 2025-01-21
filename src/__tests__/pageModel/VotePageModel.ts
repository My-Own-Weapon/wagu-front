import { Locator, Page } from '@playwright/test';

export default class VotePageModel {
  private readonly BASE_URL = 'http://localhost:3000';

  constructor(public readonly page: Page) {}

  async login(userName: string) {
    await this.page.goto(`${this.BASE_URL}/login`);

    const $userNameInput = this.page.getByRole('textbox', { name: '아이디' });
    const $passwordInput = this.page.getByRole('textbox', { name: '비밀번호' });
    const $submitButton = this.page.getByRole('button', { name: '로그인' });

    await $userNameInput.fill(userName);
    await $passwordInput.fill('asd');
    await $submitButton.click();

    return this;
  }

  async goToMapPage() {
    await this.page.goto(`${this.BASE_URL}/map`);

    return this;
  }

  async goToVotePage() {
    const $voteModal = this.page.getByTestId('create-vote-url-button');
    await $voteModal.click();

    const $navigateVoteUrlButton = this.page.getByTestId(
      'navigate-vote-url-button',
    );
    await $navigateVoteUrlButton.click();
    await this.page.waitForURL('**/vote**');

    return this;
  }

  async getVoteUrl() {
    const currentUrl = await this.page.url();
    return currentUrl;
  }

  async joinVotePage(voteUrl: string) {
    console.log('voteUrl', voteUrl);
    await this.page.goto(voteUrl);

    return this;
  }

  async getMarker() {
    await this.page.waitForSelector('[role="presentation"]');
    const marker = this.page.locator('[role="presentation"]');

    console.log('marker', marker);

    return marker;
  }

  async clickMarker(marker: Locator) {
    await marker.click();
  }

  async getNominateStores() {
    const $nominateStores = this.page.getByTestId('nominate-stores');
    // const stores = await $nominateStores.allInnerTexts();

    return $nominateStores;
  }
}
