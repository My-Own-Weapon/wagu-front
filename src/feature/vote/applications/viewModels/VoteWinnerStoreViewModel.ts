import ViewModel from '@/feature/_lib/ViewModel';
import { z, ZodError } from 'zod';

class VoteWinnerStoreViewModel extends ViewModel<VoteWinnerStoreViewModelProps> {
  private readonly storeName: string;
  private readonly storeId: number;
  private readonly storePostCount: number;
  private readonly mainMenuImageUrl: string;
  private readonly mainMenuName: string;

  constructor(props: VoteWinnerStoreViewModelProps) {
    super(props);
    this.storeName = props.storeName;
    this.storeId = props.storeId;
    this.storePostCount = props.storePostCount;
    this.mainMenuImageUrl = props.mainMenuImageUrl;
    this.mainMenuName = props.mainMenuName;
  }

  protected validateProps(
    props: VoteWinnerStoreViewModelProps,
  ): VoteWinnerStoreViewModelProps | ZodError<any> {
    return voteWinnerStoreViewModelProps.parse(props);
  }

  getWinningMessage() {
    return `${this.storeName}이 우승했어요 !`;
  }

  getStoreName() {
    return this.storeName;
  }

  getStoreId() {
    return this.storeId;
  }

  getStorePostCount() {
    return this.storePostCount;
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
  storePostCount: z.number(),
  mainMenuImageUrl: z.string(),
  mainMenuName: z.string(),
});
export type VoteWinnerStoreViewModelProps = z.infer<
  typeof voteWinnerStoreViewModelProps
>;

export default VoteWinnerStoreViewModel;
