import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';

const meta = {
  title: 'Components/Headless/Select',
  component: Select,
  args: {
    children: undefined,
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
