import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { BoxButton } from '@/components/ui';

const meta = {
  title: 'ui/BoxButton',
  component: BoxButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'radio' },
    styleType: { control: 'radio' },
    onClick: fn(),
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    width: '300px',
    onClick: fn(),
  },
} satisfies Meta<typeof BoxButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '회원가입',
    styleType: 'fill',
    type: 'button',
  },
};

export const Outline: Story = {
  args: {
    children: '로그인',
    styleType: 'outline',
    type: 'button',
  },
};
