import type { Meta, StoryObj } from '@storybook/react';
import UserIcon from '@/components/ui/UserIcon/UserIcon';

const meta = {
  title: 'UI/UserIcon',
  component: UserIcon.Root,
  args: {
    children: undefined,
    size: 'medium',
    shape: 'circle',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserIcon.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <UserIcon.Root size="medium" shape="circle" border="1px solid tomato">
      <UserIcon.Image alt="사용자 아이콘" />
    </UserIcon.Root>
  ),
};

export const WithText: Story = {
  render: () => (
    <UserIcon.Root size="medium" shape="circle">
      <UserIcon.Image alt="사용자 아이콘" />
      <UserIcon.Text fontSize="medium" color="black">
        사용자 이름
      </UserIcon.Text>
    </UserIcon.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <UserIcon.Root size="xSmall" shape="circle">
        <UserIcon.Image alt="xSmall 아이콘" />
      </UserIcon.Root>
      <UserIcon.Root size="small" shape="circle">
        <UserIcon.Image alt="small 아이콘" />
      </UserIcon.Root>
      <UserIcon.Root size="medium" shape="circle">
        <UserIcon.Image alt="medium 아이콘" />
      </UserIcon.Root>
      <UserIcon.Root size="large" shape="circle">
        <UserIcon.Image alt="large 아이콘" />
      </UserIcon.Root>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <UserIcon.Root size="medium" shape="circle" border="1px solid dodgerblue">
        <UserIcon.Image alt="원형 아이콘" />
      </UserIcon.Root>
      <UserIcon.Root size="medium" shape="square" border="1px solid darkblue">
        <UserIcon.Image alt="사각형 아이콘" />
      </UserIcon.Root>
    </div>
  ),
};

export const WithTextballoon: Story = {
  render: () => (
    <UserIcon.Root size="medium" shape="circle">
      <UserIcon.Textballoon />
      <UserIcon.Image alt="사용자 아이콘" />
      <UserIcon.Text fontSize="small" color="black">
        사용자 이름
      </UserIcon.Text>
    </UserIcon.Root>
  ),
};
