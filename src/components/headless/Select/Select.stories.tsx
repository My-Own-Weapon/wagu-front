import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';

const meta = {
  title: 'Common/Headless/Select',
  component: Select,
  args: {
    children: undefined,
  },
  argTypes: {
    value: {
      name: 'value',
      description: '선택된 값',
      control: false,
      table: {
        type: {
          summary: 'T as Any',
        },
        defaultValue: {
          summary: '선택된 값',
        },
      },
    },
    defaultValue: {
      name: 'defaultValue',
      description: '기본 선택 값',
      control: false,
      table: {
        type: {
          summary: 'T as Any',
        },
        defaultValue: {
          summary: '선택된 값',
        },
      },
    },

    onChange: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <Select defaultValue="option1">
        <Select.Trigger>선택하세요</Select.Trigger>
        <Select.Content>
          <Select.Item value="option1">옵션 1</Select.Item>
          <Select.Item value="option2">옵션 2</Select.Item>
          <Select.Item value="option3">옵션 3</Select.Item>
        </Select.Content>
      </Select>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    return (
      <Select defaultValue="option1">
        <Select.Trigger>선택하세요</Select.Trigger>
        <Select.Content>
          <Select.Group label="그룹 1">
            <Select.Item value="option1">옵션 1</Select.Item>
            <Select.Item value="option2">옵션 2</Select.Item>
          </Select.Group>
          <Select.Group label="그룹 2">
            <Select.Item value="option3">옵션 3</Select.Item>
            <Select.Item value="option4">옵션 4</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
    );
  },
};
