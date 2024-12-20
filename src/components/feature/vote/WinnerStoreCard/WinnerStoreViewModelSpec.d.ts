export interface WinnerStoreViewModelSpec {
  getStoreName: () => string;
  getStoreId: () => number;
  getMainMenuImageUrl: () => string;
  getMainMenuName: () => string;
}
