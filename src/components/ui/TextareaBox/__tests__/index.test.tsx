import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextareaBox } from '@/components/ui';

describe('TextareaBox Component', () => {
  it('renders TextareaBox with label and textarea', () => {
    render(
      <TextareaBox>
        {(id) => (
          <>
            <TextareaBox.Label htmlFor={id}>Test Label</TextareaBox.Label>
            <TextareaBox.Textarea id={id} name="test-textarea" />
          </>
        )}
      </TextareaBox>,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Test Label' }),
    ).toBeInTheDocument();
  });

  it('updates value on typing in textarea', () => {
    const handleChange = jest.fn();

    render(
      <TextareaBox>
        {(id) => (
          <>
            <TextareaBox.Label htmlFor={id}>Test Label</TextareaBox.Label>
            <TextareaBox.Textarea
              id={id}
              name="test-textarea"
              onChange={handleChange}
              placeholder="Enter text"
            />
          </>
        )}
      </TextareaBox>,
    );

    const textarea = screen.getByPlaceholderText('Enter text');

    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
