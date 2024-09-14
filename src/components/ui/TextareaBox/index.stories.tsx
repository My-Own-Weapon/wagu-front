/* eslint-disable react-hooks/rules-of-hooks */
import { ChangeEventHandler } from 'react';

import type { Args, Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';

import TextareaBox from './index';

const meta = {
  title: 'Components/TextareaBox',
  component: TextareaBox.Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    placeholder: '리뷰를 작성해 보세요.',
    value: '',
    name: 'textarea',
    readOnly: false,
    required: false,
  },

  decorators: [
    (Story, context) => {
      const [{ value }, updateArgs] = useArgs();
      return (
        <div
          style={{
            height: '100dvh',
            margin: '0 auto',
            padding: '0',
            backgroundColor: '#e9e9e9',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',

              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <Story
              args={{
                ...context.args,
                value,
                onChange: handleChange(updateArgs),
              }}
            />
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof TextareaBox.Textarea>;
export default meta;

type Story = StoryObj<typeof meta>;

const handleChange = (
  setArgs: (args: Args) => void,
): ChangeEventHandler<HTMLTextAreaElement> => {
  return (e) => {
    setArgs({ value: e.target.value });
  };
};

export const Default: Story = {
  render: (args) => (
    <TextareaBox>
      {(id) => (
        <>
          <TextareaBox.Label htmlFor={id}>리뷰 작성란</TextareaBox.Label>
          <TextareaBox.Textarea {...args} id={id} />
        </>
      )}
    </TextareaBox>
  ),
};

export const WithInitialValue: Story = {
  args: {
    value: '단어가 길어지면 자동으로 높이가 늘어납니다.\n'.repeat(20),
  },
  render: (args) => (
    <TextareaBox>
      {(id) => (
        <>
          <TextareaBox.Label htmlFor={id}>초기 밸류 포함</TextareaBox.Label>
          <TextareaBox.Textarea {...args} id={id} />
        </>
      )}
    </TextareaBox>
  ),
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only value',
  },
  render: (args) => (
    <TextareaBox>
      {(id) => (
        <>
          <TextareaBox.Label htmlFor={id}>리드온리</TextareaBox.Label>
          <TextareaBox.Textarea {...args} id={id} />
        </>
      )}
    </TextareaBox>
  ),
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => (
    <TextareaBox>
      {(id) => (
        <>
          <TextareaBox.Label htmlFor={id}>required</TextareaBox.Label>
          <TextareaBox.Textarea {...args} id={id} />
        </>
      )}
    </TextareaBox>
  ),
};
