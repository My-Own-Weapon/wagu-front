import '@testing-library/jest-dom/vitest';
import React from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Select from './Select';

describe('Select 컴포넌트', () => {
  let I: UserEvent;

  beforeEach(() => {
    I = userEvent.setup();
    cleanup();
  });

  const options = ['옵션1', '옵션2', '옵션3'];

  function DefaultSelect() {
    return (
      <Select defaultValue={options[0]}>
        <Select.Trigger>선택하기</Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option} value={option}>
              {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    );
  }

  test('트리거를 클릭하지 않은 첫 렌더링에는 content가 표시되지 않아야 한다.', async () => {
    render(<DefaultSelect />);

    const $notDisplayedContent = screen.queryByTestId('select-content');
    expect($notDisplayedContent).not.toBeInTheDocument();

    const $trigger = screen.getByTestId('select-trigger');
    await I.click($trigger);

    const $content = screen.getByTestId('select-content');
    expect($content).toBeVisible();
  });

  test('트리거를 클릭시 옵션 개수가 정확해야 한다.', async () => {
    render(<DefaultSelect />);

    const $trigger = screen.getByTestId('select-trigger');

    const $notDisplayedContent = screen.queryByTestId('select-content');
    expect($notDisplayedContent).not.toBeInTheDocument();

    await I.click($trigger);

    const $options = screen.getAllByTestId('select-item');
    expect($options).toHaveLength(3);
  });

  test('옵션 선택시 목록이 닫힘', async () => {
    render(<DefaultSelect />);

    const $trigger = screen.getByTestId('select-trigger');
    await I.click($trigger);

    const $option = screen.getByRole('option', { name: '옵션2' });
    await I.click($option);

    const $content = screen.queryByTestId('select-content');
    expect($content).not.toBeInTheDocument();
  });

  test('외부 클릭시 목록이 닫힘', async () => {
    render(
      <div>
        <DefaultSelect />
        <div data-testid="outside">Close Select</div>
      </div>,
    );

    const $trigger = screen.getByTestId('select-trigger');
    await I.click($trigger);

    const $outside = screen.getByTestId('outside');
    await I.click($outside);

    const $content = screen.queryByTestId('select-content');
    expect($content).not.toBeInTheDocument();
  });

  test('제어 컴포넌트로 동작을 확인한다.', async () => {
    const handleChange = vi.fn();

    render(
      <Select value={options[0]} onChange={handleChange}>
        <Select.Trigger>선택하기</Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option} value={option}>
              {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>,
    );

    const $trigger = screen.getByTestId('select-trigger');
    await I.click($trigger);

    const $option = screen.getByRole('option', { name: '옵션2' });
    await I.click($option);

    expect(handleChange).toHaveBeenCalledWith('옵션2');
    expect(handleChange).not.toHaveBeenCalledWith('옵션1');
  });
});
