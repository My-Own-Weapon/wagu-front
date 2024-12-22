import { Meta, StoryObj } from '@storybook/react';

import { PostCard } from '@/components';

const meta = {
  title: 'components/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  argTypes: {
    postMainMenu: { control: 'text' },
    storeName: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '375px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    postId: 1004,
    postMainMenu: '호박고구마',
    storeName: '무늬네 고구마',
    createdDate: '2024-07-26T15:03:03.196666',
    menuImage: { id: 'zl존고구마', url: '/images/mock-food.png' },
  },
};
