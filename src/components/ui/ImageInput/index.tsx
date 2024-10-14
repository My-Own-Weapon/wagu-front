'use client';

import React, { ChangeEventHandler, HTMLProps, useId } from 'react';

import * as Icon from '@public/newDesign/index';

import s from './index.module.scss';

interface InputBoxProps extends HTMLProps<HTMLInputElement> {
  width?: string;
  height?: string;
  label?: string;
  type?: 'file';
  accept?: 'image/*' | 'video/*' | 'audio/*' | 'application/pdf';
  value?: string;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
}

/* ✅ TODO: Input과 textarea 컴포넌트 분리 */
export default function ImageInput({
  width = '100%',
  height = '56px',
  label = '',
  placeholder = '',
  type = 'file',
  accept = undefined,
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
    <div className={s.container}>
      <label className={s.fileLabel} htmlFor={id}>
        <Icon.CameraSVG />
        {label && <p className={s.labelText}>{label}</p>}
      </label>
      <input
        id={id}
        className={s.fileInputBox}
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
        readOnly={readOnly}
        required
      />
    </div>
  );
}
