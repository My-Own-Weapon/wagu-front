/* eslint-disable brace-style */

import ViewModel from '@/feature/_lib/ViewModel';
import { WinnerStoreViewModelImpl } from '@/components/feature/vote/WinnerStoreCard/WinnerStoreCardImple';
import { z } from 'zod';

class WinnerStoreViewModel
  extends ViewModel
  implements WinnerStoreViewModelImpl
{
  private readonly storeName: string;
  private readonly storeId: number;
  private readonly mainMenuImageUrl: string;
  private readonly mainMenuName: string;

  constructor(props: VoteWinnerStoreViewModelProps) {
    super(props);
    this.storeName = props.storeName;
    this.storeId = props.storeId;
    this.mainMenuImageUrl = props.mainMenuImageUrl;
    this.mainMenuName = props.mainMenuName;
  }

  // eslint-disable-next-line class-methods-use-this
  protected validateProps(props: VoteWinnerStoreViewModelProps) {
    return voteWinnerStoreViewModelProps.parse(props);
  }

  getStoreName() {
    return this.storeName;
  }

  getWinningMessage() {
    return `${this.storeName}이 우승했어요 !`;
  }

  getStoreId() {
    return this.storeId;
  }

  getMainMenuImageUrl() {
    return this.mainMenuImageUrl;
  }

  getMainMenuName() {
    return this.mainMenuName;
  }
}

const voteWinnerStoreViewModelProps = z.object({
  storeName: z.string(),
  storeId: z.number(),
  mainMenuImageUrl: z.string(),
  mainMenuName: z.string(),
});
export type VoteWinnerStoreViewModelProps = z.infer<
  typeof voteWinnerStoreViewModelProps
>;

export default WinnerStoreViewModel;
