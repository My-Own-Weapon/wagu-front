import type { Meta, StoryObj } from '@storybook/react';
import { CandidateStoresViewModel } from '@/feature/vote/viewModels';
import { CandidateStore } from '@/components/feature/vote';
import { Spacing } from '@/components/ui';
import { Fragment } from 'react';

const meta = {
  title: 'Domain/Vote/CandidateStore',
  component: CandidateStore,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '410px', padding: '16px' }}>
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

export const candidateStoreList: Story = {
  args: {
    viewModel: mockViewModel,
    onRemoveCandidateStore: () => {
      alert('가게가 투표 목록에서 제거되었습니다.');
    },
  },

  render: (args) => {
    return (
      <ul>
        {Array.from({ length: 5 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            <div
              style={{
                position: 'relative',
                border: '1px solid tomato',
                borderRadius: '4px',
                paddingLeft: '16px',
              }}
            >
              <CandidateStore {...args} />
            </div>
            {index !== 4 && <Spacing size={16} />}
          </Fragment>
        ))}
      </ul>
    );
  },
};
