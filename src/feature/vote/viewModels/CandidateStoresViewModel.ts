import { z } from 'zod';
import ViewModel from '@/feature/_lib/ViewModel';

export default class CandidateStoresViewModel extends ViewModel {
  private readonly mainMenuName: string;
  private readonly mainMenuImageUrl: string;
  private readonly storeName: string;
  private readonly storeId: number;

  constructor(props: CandidateStoreViewModelProps) {
    super(props);
    this.mainMenuName = props.mainMenuName;
    this.mainMenuImageUrl = props.mainMenuImageUrl;
    this.storeName = props.storeName;
    this.storeId = props.storeId;
  }

  // eslint-disable-next-line class-methods-use-this
  protected override validateProps(props: CandidateStoreViewModelProps) {
    return candidateStoreViewModelProps.parse(props);
  }

  getMainMenuName() {
    return this.mainMenuName;
  }

  getMainMenuImageUrl() {
    return this.mainMenuImageUrl;
  }

  getStoreName() {
    return this.storeName;
  }

  getStoreId() {
    return this.storeId;
  }
}

const candidateStoreViewModelProps = z.object({
  mainMenuName: z.string(),
  mainMenuImageUrl: z.string(),
  storeName: z.string(),
  storeId: z.number(),
});
export type CandidateStoreViewModelProps = z.infer<
  typeof candidateStoreViewModelProps
>;
