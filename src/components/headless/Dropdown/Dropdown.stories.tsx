import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from './Dropdown';

const meta = {
  title: 'Common/Headless/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: undefined,
    offsetX: 0,
    offsetY: 0,
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    offsetX: {
      name: 'offsetX',
      description: 'Trigger Button에서 X만큼 떨어진 위치에 표시',
      control: {
        type: 'number',
      },
      table: {
        defaultValue: {
          summary: '0',
        },
      },
    },
    offsetY: {
      name: 'offsetY',
      description: 'Trigger Button에서 Y만큼 떨어진 위치에 표시',
      control: {
        type: 'number',
      },
      table: {
        type: {
          summary: 'number',
        },
        defaultValue: {
          summary: '0',
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown | typeof Dropdown.Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ offsetX, offsetY }) => (
    <Dropdown>
      <Dropdown.Trigger>메뉴 열기</Dropdown.Trigger>
      <Dropdown.Portal offsetX={offsetX} offsetY={offsetY}>
        <Dropdown.Content>
          <Dropdown.Item onSelect={() => alert('메뉴 1 선택')}>
            메뉴 1
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => alert('메뉴 2 선택')}>
            메뉴 2
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => alert('메뉴 3 선택')}>
            메뉴 3
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const DoublGrouped: Story = {
  render: ({ offsetX, offsetY }) => (
    <Dropdown>
      <Dropdown.Trigger>그룹 메뉴 열기</Dropdown.Trigger>
      <Dropdown.Portal offsetX={offsetX} offsetY={offsetY}>
        <Dropdown.Content>
          <Dropdown.Group label="그룹 1">
            <Dropdown.Label>그룹 1 레이블</Dropdown.Label>
            <Dropdown.Item onSelect={() => alert('그룹 1 - 메뉴 1')}>
              그룹 1 - 메뉴 1
            </Dropdown.Item>
            <Dropdown.Item onSelect={() => alert('그룹 1 - 메뉴 2')}>
              그룹 1 - 메뉴 2
            </Dropdown.Item>
          </Dropdown.Group>
          <Dropdown.Group label="그룹 2">
            <Dropdown.Label>그룹 2 레이블</Dropdown.Label>
            <Dropdown.Item onSelect={() => alert('그룹 2 - 메뉴 1')}>
              그룹 2 - 메뉴 1
            </Dropdown.Item>
            <Dropdown.Item onSelect={() => alert('그룹 2 - 메뉴 2')}>
              그룹 2 - 메뉴 2
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const DisabledItemWithDoubleDropdown: Story = {
  render: ({ offsetX, offsetY }) => (
    <>
      <Dropdown>
        <Dropdown.Trigger>비활성화 메뉴 포함 1</Dropdown.Trigger>
        <Dropdown.Portal offsetX={offsetX} offsetY={offsetY}>
          <Dropdown.Content>
            <Dropdown.Item onSelect={() => alert('활성화된 메뉴')}>
              활성화된 메뉴 1-1
            </Dropdown.Item>
            <Dropdown.Item disabled onSelect={() => alert('비활성화된 메뉴')}>
              비활성화된 메뉴 1-2
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger>비활성화 메뉴 포함 2</Dropdown.Trigger>
        <Dropdown.Portal>
          <Dropdown.Content>
            <Dropdown.Item onSelect={() => alert('활성화된 메뉴')}>
              활성화된 메뉴 2-1
            </Dropdown.Item>
            <Dropdown.Item disabled onSelect={() => alert('비활성화된 메뉴')}>
              비활성화된 메뉴 2-2
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown>
    </>
  ),
};

export const HasOffset: Story = {
  render: ({ offsetX, offsetY }) => (
    <Dropdown>
      <Dropdown.Trigger>오프셋 메뉴</Dropdown.Trigger>
      <Dropdown.Portal offsetX={offsetX} offsetY={offsetY}>
        <Dropdown.Content>
          <Dropdown.Item onSelect={() => alert('메뉴 1')}>메뉴 1</Dropdown.Item>
          <Dropdown.Item onSelect={() => alert('메뉴 2')}>메뉴 2</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};
