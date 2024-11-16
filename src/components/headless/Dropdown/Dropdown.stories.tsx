import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from './Dropdown';

const meta = {
  title: 'Components/Headless/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '3rem', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>메뉴 열기</Dropdown.Trigger>
      <Dropdown.Portal>
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

export const Grouped: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>그룹 메뉴 열기</Dropdown.Trigger>
      <Dropdown.Portal>
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

export const DisabledItem: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>비활성화 메뉴 포함</Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item onSelect={() => alert('활성화된 메뉴')}>
            활성화된 메뉴
          </Dropdown.Item>
          <Dropdown.Item disabled onSelect={() => alert('비활성화된 메뉴')}>
            비활성화된 메뉴
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const HasOffset: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger>오프셋 메뉴</Dropdown.Trigger>
      <Dropdown.Portal offsetX={20} offsetY={20}>
        <Dropdown.Content>
          <Dropdown.Item onSelect={() => alert('메뉴 1')}>메뉴 1</Dropdown.Item>
          <Dropdown.Item onSelect={() => alert('메뉴 2')}>메뉴 2</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};
