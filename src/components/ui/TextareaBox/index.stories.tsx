import { ChangeEventHandler, ComponentProps } from 'react';

import type { Args, Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';

import TextareaBox from './index';

const meta: Meta<
  ComponentProps<typeof TextareaBox> &
    ComponentProps<typeof TextareaBox.Textarea>
> = {
  title: 'ui/TextareaBox',
  component: TextareaBox,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    placeholder: '리뷰를 작성해 보세요.',
    value: '',
    name: 'review',
  },

  decorators: [
    (Story, context) => {
      const [{ value }, updateArgs] = useArgs();

      return (
        <Story
          args={{
            ...context.args,
            value,
            onChange: handleChange(updateArgs),
          }}
        />
      );
    },
  ],
};
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
