import { expect, test, describe, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from './Dropdown';

describe('Dropdown Component', () => {
  beforeEach(() => {
    cleanup();
  });

  test('드랍다운 트리거 클릭 시 드랍다운 열림고 content 외부를 클릭시 닫혀야한다.', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={() => {}}>Item 1</Dropdown.Item>
          <Dropdown.Item onSelect={() => {}}>Item 2</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.queryByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('드랍다운 아이템 클릭 시 onSelect 호출되어야 한다.', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Item 1</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    await user.click(screen.getByText('Open Menu'));
    await user.click(screen.getByText('Item 1'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('비활성화된 드랍다운 아이템 클릭 시 onSelect 호출되지 않아야 한다.', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect} disabled>
            Item 1
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    await user.click(screen.getByText('Open Menu'));
    await user.click(screen.getByText('Item 1'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  test('키보드로 네비게이션이 가능해야 한다.', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Item 1</Dropdown.Item>
          <Dropdown.Item onSelect={onSelect}>Item 2</Dropdown.Item>
          <Dropdown.Item onSelect={onSelect}>Item 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    await user.click(screen.getByText('Open Menu'));

    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Item 1')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Item 2')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Item 1')).toHaveFocus();
    /* reverse */
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Item 3')).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test('Content 외부 클릭 시 닫혀야 한다.', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Dropdown>
          <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onSelect={() => {}}>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
        <button type="button">Outside Button</button>
      </div>,
    );

    await user.click(screen.getByText('Open Menu'));
    expect(screen.queryByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByText('Outside Button'));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('드랍다운 상태에 따른 ARIA 속성이 있어야 한다.', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={() => {}}>Item 1</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>,
    );

    const trigger = screen.getByText('Open Menu');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
