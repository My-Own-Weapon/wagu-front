import { Locator, Page } from '@playwright/test';

export default class WritePageModel {
  private readonly BASE_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://wagubook.shop'
      : 'http://localhost:3000';

  private readonly $addressInput: Locator;

  private readonly $menuImageInput: Locator;

  private readonly $reviewInput: Locator;

  private readonly $categorySelectTrigger: Locator;

  private readonly $addressSearchTrigger: Locator;

  private readonly $addressSearchResults: Locator;

  private readonly $menuNameInput: Locator;

  private readonly $menuPriceInput: Locator;

  private readonly $submitButton: Locator;

  constructor(private readonly page: Page) {
    this.$addressInput = this.getByNameAttrOfInput('address');
    this.$menuImageInput = this.getByNameAttrOfInput('menu');
    this.$reviewInput = this.page.locator(
      'textarea[name="menuReviews.0.menuContent"]',
    );
    this.$categorySelectTrigger = this.page.getByTestId(
      'category-select-trigger',
    );
    this.$addressSearchTrigger = this.page.getByTestId(
      'address-search-trigger',
    );
    this.$addressSearchResults = this.page.getByTestId(
      'address-search-results',
    );

    this.$menuNameInput = this.getByNameAttrOfInput('menuReviews.0.menuName');
    this.$menuPriceInput = this.getByNameAttrOfInput('menuReviews.0.menuPrice');
    this.$submitButton = this.page.locator('button[type="submit"]');
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

  get menuNameInput() {
    return this.$menuNameInput;
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

  get addressSearchTrigger() {
    return this.$addressSearchTrigger;
  }

  get addressSearchResults() {
    return this.$addressSearchResults;
  }

  get submitButton() {
    return this.$submitButton;
  }
}
