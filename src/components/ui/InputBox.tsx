'use client';

import { ChangeEventHandler, useId } from 'react';
import classNames from 'classnames';
import s from './InputBox.module.scss';

type InputBoxProps = {
  width?: string;
  height?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'password' | 'tel' | 'textarea' | 'file';
  accept?: 'image/*' | 'video/*' | 'audio/*' | 'application/pdf';
  value?: string;
  name: string;
  onFocus?: () => void;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  readOnly?: boolean;
};

/* ✅ TODO: Input과 textarea 컴포넌트 분리 */
export default function InputBox({
  width = '100%',
  height = '56px',
  className = '',
  label = '',
  placeholder = '',
  type = 'text',
  accept = undefined,
  name,
  value = undefined,
  onFocus = undefined,
  onChange = undefined,
  readOnly = false,
}: InputBoxProps) {
  const id = useId();
  const inputClassNames = classNames(
    {
      [s.inputBoxs]: type !== 'file',
      [s.fileInputBox]: type === 'file',
    },
    className,
  );
  const labelClassNames = classNames({
    [s.overwrapLabelOfFileInput]: type === 'file',
    [s.label]: type !== 'file',
  });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    if (!onChange) return;

    onChange(event);
  };

  return (
    <div className={s.container}>
      {(label || type === 'file') && (
        <label className={labelClassNames} htmlFor={id}>
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          className={s.inputBoxs}
          id={id}
          style={{
            width,
            height,
            padding: 16,
          }}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          required
        />
      ) : (
        <input
          className={inputClassNames}
          id={id}
          type={type}
          style={{
            width,
            height,
          }}
          name={name}
          placeholder={placeholder}
          accept={accept}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          readOnly={readOnly}
          required
        />
      )}
    </div>
  );
}
