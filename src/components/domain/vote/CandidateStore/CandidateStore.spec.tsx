import '@testing-library/jest-dom/vitest';

import { MouseEventHandler } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { describe, vi, expect, beforeEach, it } from 'vitest';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { CandidateStoresViewModel } from '@/feature/vote/viewModels';
import CandidateStore from './CandidateStore';
import React from 'react';

describe('CandidateStore', () => {
  let I: UserEvent;
  let viewModel: CandidateStoresViewModel;
  let mockOnRemoveCandidateStore: MouseEventHandler<HTMLButtonElement>;

  beforeEach(() => {
    cleanup();
    viewModel = new CandidateStoresViewModel({
      mainMenuName: 'test',
      mainMenuImageUrl: 'test',
      storeName: 'test',
      storeId: 1,
    });
    mockOnRemoveCandidateStore = vi.fn();
    I = userEvent.setup();
  });

  it('should render', () => {
    render(
      <CandidateStore
        viewModel={viewModel}
        onRemoveCandidateStore={mockOnRemoveCandidateStore}
      />,
    );

    const $storeName = screen.getByText(viewModel.getStoreName());
    const $userIcon = screen.getByRole('img');
    const $removeButton = screen.getByTestId('remove-candidate-store-button');

    expect($storeName).toBeInTheDocument();
    expect($userIcon).toBeInTheDocument();
    expect($removeButton).toBeInTheDocument();
  });

  it('remove 버튼 클릭시 onRemoveCandidateStore 함수가 호출된다', async () => {
    render(
      <CandidateStore
        viewModel={viewModel}
        onRemoveCandidateStore={mockOnRemoveCandidateStore}
      />,
    );

    const $removeButton = screen.getByTestId('remove-candidate-store-button');
    await I.click($removeButton);

    expect(mockOnRemoveCandidateStore).toHaveBeenCalled();
  });

  it('여러개의 CandidateStore 컴포넌트가 렌더링되고 특정 컴포넌트를 remove 했을시에 해당 컴포넌트만 삭제되어야 한다.', async () => {
    const initialViewModels: CandidateStoresViewModel[] = Array.from(
      { length: 3 },
      (_, index) =>
        new CandidateStoresViewModel({
          mainMenuName: `test${index}`,
          mainMenuImageUrl: `test${index}`,
          storeName: `test${index}`,
          storeId: index,
        }),
    );

    function TestCandidateStores() {
      const [viewModels, setViewModels] = React.useState(initialViewModels);

      const handleRemoveCandidateStore = (storeId: number) => {
        setViewModels((prev) =>
          prev.filter((vm) => vm.getStoreId() !== storeId),
        );
      };

      return (
        <ul>
          {viewModels.map((viewModel) => (
            <CandidateStore
              key={viewModel.getStoreId()}
              viewModel={viewModel}
              onRemoveCandidateStore={() =>
                handleRemoveCandidateStore(viewModel.getStoreId())
              }
            />
          ))}
        </ul>
      );
    }

    render(<TestCandidateStores />);

    const $$initialRemoveButtons = screen.getAllByTestId(
      'remove-candidate-store-button',
    );
    expect($$initialRemoveButtons).toHaveLength(3);

    const $removeButton = $$initialRemoveButtons[1]!;
    await I.click($removeButton);

    const updatedRemoveButtons = screen.getAllByTestId(
      'remove-candidate-store-button',
    );
    expect(updatedRemoveButtons).toHaveLength(2);
    expect($removeButton).not.toBeInTheDocument();
  });
});
