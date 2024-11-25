import type { Meta, StoryObj } from '@storybook/react';

import { WinnerStoreViewModel } from '@/feature/vote/viewModels';
import WinnerStoreCard from './WinnerStoreCard';

interface StoryArgs {
  viewModel?: WinnerStoreViewModel;
  storeName: string;
  mainMenuName: string;
}

const meta = {
  title: 'Domain/Vote/WinnerStoreCard',
  component: WinnerStoreCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    storeName: '평범한 이름의 식당',
    mainMenuName: '평범한 메뉴',
    viewModel: undefined,
  },
  argTypes: {
    storeName: {
      description: '가게 상호명',
      control: 'text',
    },
    mainMenuName: {
      description: '해당 가게의 메인 메뉴 이름',
      control: 'text',
    },
    viewModel: {
      description: 'WinnerStoreCard 컴포넌트에 전달되는 뷰모델',
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '375px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WinnerStoreCard | StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    storeName: '평범한 이름의 식당',
    mainMenuName: '평범한 메뉴',
    viewModel: undefined,
  },
  render: (args) => {
    const viewModel = new WinnerStoreViewModel({
      storeId: 1,
      storeName: args.storeName,
      mainMenuImageUrl: 'https://picsum.photos/400/300',
      mainMenuName: args.mainMenuName,
    });

    return <WinnerStoreCard viewModel={viewModel} />;
  },
};

export const LongText: Story = {
  args: {
    storeName: '매우 긴 가게 이름을 가진 맛있는 식당',
    mainMenuName: '매우 긴 메뉴 이름을 가진 시그니처 메뉴',
  },
  render: (args) => {
    const viewModel = new WinnerStoreViewModel({
      storeId: 2,
      mainMenuImageUrl: 'https://picsum.photos/400/300',
      storeName: args.storeName,
      mainMenuName: args.mainMenuName,
    });

    return <WinnerStoreCard viewModel={viewModel} />;
  },
};
