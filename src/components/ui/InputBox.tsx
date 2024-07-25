'use client';

import { ChangeEventHandler, useEffect, useId, useRef } from 'react';
import * as Icon from '@public/newDesign/index';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const inputClassNames = classNames(
    {
      [s.inputBoxs]: type !== 'file',
      [s.fileInputBox]: type === 'file',
    },
    className,
  );
  const labelClassNames = classNames({
    [s.fileLabel]: type === 'file',
    [s.label]: type !== 'file',
  });

  useEffect(() => {
    if (type === 'textarea' && textareaRef.current) {
      /* auto로 갱신해줘야 글을 지웠을때 줄어듭니다. */
      const $textarea = textareaRef.current;
      $textarea.style.height = 'auto';
      $textarea.style.height = `calc(${$textarea.scrollHeight}px - 48px)`;
    }
  }, [value, type]);

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    if (!onChange) return;

    onChange(event);
  };

  return (
    <div className={s.container}>
      {type === 'file' && (
        <label className={labelClassNames} htmlFor={id}>
          <Icon.CameraSVG />
          {label && <p className={s.labelText}>{label}</p>}
        </label>
      )}

      {type !== 'file' && label && (
        <label className={labelClassNames} htmlFor={id}>
          <p className={s.labelText}>{label}</p>
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          ref={textareaRef}
          className={s.reviewInput}
          id={id}
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
