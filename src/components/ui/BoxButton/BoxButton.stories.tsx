import { Meta, StoryObj } from '@storybook/react';

import { BoxButton } from '@/components/ui';

const meta = {
  title: 'ui/BoxButton',
  component: BoxButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '버튼 컴포넌트',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: {
      name: 'Button inner text',
      description: '버튼의 텍스트 ex) 회원가입',
      control: 'text',
      table: {
        type: {
          summary: 'string | ReactNode',
          detail:
            'Is string or ReactNode. If you want to use ReactNode, you can use it as a child.',
        },
      },
    },
    width: {
      control: 'text',
      description: '버튼의 너비',
      table: {
        type: {
          summary: 'string',
          detail: '숫자 뒤에 반드시 px, %, vw 등의 단위를 포함해야 합니다.',
        },
      },
    },
    height: {
      control: 'radio',
      description: '버튼의 높이',
      table: {
        type: {
          summary: '48px | 56px',
        },
      },
    },
    styleType: { control: 'radio', description: '버튼 스타일' },
    disabled: {
      control: 'boolean',
      description: '버튼의 비활성화 여부 ',
    },
    type: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
  args: {
    onClick: () => {
      alert('clicked');
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '280px',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BoxButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '회원가입',
    styleType: 'fill',
  },
};

export const Outline: Story = {
  args: {
    children: '로그인',
    styleType: 'outline',
  },
};

export const Disabled: Story = {
  args: {
    children: '회원가입',
    styleType: 'fill',
    disabled: true,
  },
};
