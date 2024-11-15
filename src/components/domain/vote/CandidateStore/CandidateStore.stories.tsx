import type { Meta, StoryObj } from '@storybook/react';
import CandidateStore from './CandidateStore';
import { CandidateStoresViewModel } from '@/feature/vote/applications/viewModels';

const meta = {
  title: 'Domain/Vote/CandidateStore',
  component: CandidateStore,
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
} satisfies Meta<typeof CandidateStore>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockViewModel = new CandidateStoresViewModel({
  mainMenuName: '떡볶이',
  mainMenuImageUrl: '/images/menu/tteokbokki.jpg',
  storeName: '엽기떡볶이 강남점',
  storeId: 1,
});

export const Default: Story = {
  args: {
    viewModel: mockViewModel,
    onRemoveCandidateStore: () => {
      alert('가게가 투표 목록에서 제거되었습니다.');
    },
  },
};

export const LongStoreName: Story = {
  args: {
    viewModel: new CandidateStoresViewModel({
      mainMenuName: '떡볶이',
      mainMenuImageUrl: '/images/menu/tteokbokki.jpg',
      storeName: '매우 긴 가게 이름을 가진 엽기떡볶이 강남역점 1호점',
      storeId: 2,
    }),
    onRemoveCandidateStore: () => {
      alert('가게가 투표 목록에서 제거되었습니다.');
    },
  },
};
