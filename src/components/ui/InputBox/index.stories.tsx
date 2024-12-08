import type { Meta, StoryObj } from '@storybook/react';
import { ReactNode } from 'react';

import { InputBoxWrapper } from '@/app/(post)/write/_components';
import InputBox from './index';

const meta = {
  title: 'UI/InputBox',
  component: InputBox.Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'InputBox 컴포넌트',
      },
    },
  },

  argTypes: {
    width: {
      control: 'text',
      description: 'Input 너비를 설정합니다.',
      table: {
        type: { summary: '{n}px | {n}% | {n}vw' },
      },
    },
    height: {
      control: 'select',
      options: [48, 56],
      description: 'Input 높이를 설정합니다.',
      table: {
        type: { summary: '48 | 56' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder 설정',
    },
    type: {
      control: 'select',
      options: ['text', 'number', 'password', 'tel'],
      description: 'Input type을 설정합니다.',
      table: {
        type: { summary: 'text | number | password | tel' },
      },
    },
  },
  args: {
    width: '100%',
    height: 48,
    placeholder: '아이디를 입력해주세요',
    type: 'text',
  },
} satisfies Meta<typeof InputBox.Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <InputBox>
      <InputBox.Label>아이디</InputBox.Label>
      <InputBox.Input {...args} />
    </InputBox>
  ),
};

export const WithStyledWrapper: Story = {
  render: (args) => (
    <StyledWrapper>
      <InputBox>
        <InputBox.Label>아이디</InputBox.Label>
        <InputBox.Input {...args} />
      </InputBox>
    </StyledWrapper>
  ),
};

export const WithErrorMessage: Story = {
  render: (args) => (
    <InputBox errorMessage="아이디는 영문자만 입력 가능합니다.">
      <InputBox.Label>아이디</InputBox.Label>
      <InputBox.Input {...args} />
    </InputBox>
  ),
};

export const WithStyledWrapperAndErrorMessage: Story = {
  render: (args) => (
    <StyledWrapper>
      <InputBox errorMessage="아이디는 영문자만 입력 가능합니다.">
        <InputBox.Label>아이디</InputBox.Label>
        <InputBox.Input {...args} />
      </InputBox>
    </StyledWrapper>
  ),
};

function StyledWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        maxWidth: '400px',
        padding: '16px',
        backgroundColor: '#f0f0f0',
      }}
    >
      <InputBoxWrapper gap="8px">{children}</InputBoxWrapper>
    </div>
  );
}
