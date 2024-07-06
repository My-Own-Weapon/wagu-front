'use client';

import { ChangeEvent, ChangeEventHandler, useId } from 'react';

type InputBoxProps = {
  className?: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'password' | 'tel';
  value?: string;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

export default function InputBox({
  className = '',
  label,
  placeholder = undefined,
  type = 'text',
  name,
  value = undefined,
  onChange = undefined,
  readOnly = false,
}: InputBoxProps) {
  const id = useId();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!onChange) return;

    onChange(event);
  };

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        required
      />
    </div>
  );
}
