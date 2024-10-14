import { InputBox } from '@/components/ui';
import { Args, Meta, StoryObj } from '@storybook/react';
import { ChangeEventHandler, ComponentType } from 'react';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
  title: 'ui/InputBox',
  component: InputBox,
  tags: ['autodocs'],
  args: {
    width: '100%',
    value: '',
  },
  subcomponents: {
    'InputBox.Input': InputBox.Input as ComponentType<unknown>,
    'InputBox.Label': InputBox.Label as ComponentType<unknown>,
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
} satisfies Meta<typeof InputBox & ComponentType>;
export default meta;

type Story = StoryObj<typeof meta>;

const handleChange = (
  setArgs: (args: Args) => void,
): ChangeEventHandler<HTMLInputElement> => {
  return (e) => {
    setArgs({ value: e.target.value });
  };
};

export const Default: Story = {
  args: {
    type: 'text',
  },
  render: (args) => (
    <InputBox>
      <InputBox.Label>아이디</InputBox.Label>
      <InputBox.Input {...args} />
    </InputBox>
  ),
};

export const Tel: Story = {
  args: {
    type: 'tel',
    placeholder: '000-0000-0000',
  },
  render: (args) => (
    <InputBox>
      <InputBox.Label>전화번호</InputBox.Label>
      <InputBox.Input {...args} />
    </InputBox>
  ),
};

export const Errors: Story = {
  args: {
    width: '100%',
    height: 56,
    type: 'text',
    errorMessage: '아이디를 입력해 주세요',
    value: 'asd',
  },
  render: (args) => (
    <InputBox errorMessage={args.errorMessage}>
      <InputBox.Label>아이디</InputBox.Label>
      <InputBox.Input {...args} />
    </InputBox>
  ),
};
