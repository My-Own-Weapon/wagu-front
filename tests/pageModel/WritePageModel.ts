import { Locator, Page } from '@playwright/test';

export default class WritePageModel {
  private readonly BASE_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://wagubook.shop'
      : 'http://localhost:3000';

  private readonly $addressInput: Locator;

  private readonly $menuImageInput: Locator;

  private readonly $menuPriceInput: Locator;

  private readonly $reviewInput: Locator;

  private readonly $categorySelectTrigger: Locator;

  constructor(private readonly page: Page) {
    this.$addressInput = this.getByNameAttrOfInput('address');
    this.$menuImageInput = this.getByNameAttrOfInput('menu');
    this.$menuPriceInput = this.getByNameAttrOfInput('menuPrice');
    this.$reviewInput = this.page.getByRole('textbox', {
      name: '리뷰',
    });
    this.$categorySelectTrigger = this.page.getByTestId(
      'category-select-trigger',
    );
  }

  private getByNameAttrOfInput(name: string) {
    return this.page.locator(`input[name="${name}"]`);
  }

  async gotoWritePage() {
    await this.page.goto(`${this.BASE_URL}/write`);
  }

  get addressInput() {
    return this.$addressInput;
  }

  get menuImageInput() {
    return this.$menuImageInput;
  }

  get menuPriceInput() {
    return this.$menuPriceInput;
  }

  get reviewInput() {
    return this.$reviewInput;
  }

  get categorySelectTrigger() {
    return this.$categorySelectTrigger;
  }
}
