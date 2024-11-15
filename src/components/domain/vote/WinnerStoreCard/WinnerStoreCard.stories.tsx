import type { Meta, StoryObj } from '@storybook/react';
import WinStoreCard from './WinnerStoreCard';

const meta = {
  title: 'Domain/Vote/WinnerStoreCard',
  component: WinStoreCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '410px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WinStoreCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    storeId: 1,
    storeName: '맛있는 식당',
    menuImage: {
      url: 'https://picsum.photos/400/300',
    },
    postCount: 10,
    menuName: '시그니처 메뉴',
  },
};

export const LongText: Story = {
  args: {
    storeId: 2,
    storeName: '매우 긴 가게 이름을 가진 맛있는 식당',
    menuImage: {
      url: 'https://picsum.photos/400/300',
    },
    postCount: 15,
    menuName: '매우 긴 메뉴 이름을 가진 시그니처 메뉴',
  },
};
