/* eslint-disable react/require-default-props */
/** input.defaultProps를 사용하면 타입문제는 해결되지만
 *  react 18 이상부터는 권장되지 않는 방식이기에 eslint 무시만 처리함 */

'use client';

import React, {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useId,
} from 'react';

import s from './index.module.scss';

interface InputBoxProps {
  children: (id: string) => ReactNode;
}

export default function InputBox({ children }: InputBoxProps) {
  const id = useId();

  return <div className={s.container}>{children(id)}</div>;
}

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  id?: string;
  width?: string;
  height: 48 | 56;
  type?: 'text' | 'number' | 'password' | 'tel';
  pattern?: string;
  name: string;
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: () => void;
  required?: boolean;
  readOnly?: boolean;
}

InputBox.Input = forwardRef(function InputBox__Input(
  {
    id = undefined,
    width = '100%',
    height = 56,
    type = 'text',
    pattern = undefined,
    name,
    value = undefined,
    placeholder = '',
    onChange = undefined,
    onFocus = undefined,
    required = false,
    readOnly = false,
    ...rest
  }: InputProps,
  forwardedRef: React.Ref<HTMLInputElement>,
) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!onChange) return;

    onChange(event);
  };

  return (
    <input
      id={id}
      className={s.inputBox}
      style={{
        width,
        height,
      }}
      type={type}
      value={value}
      pattern={pattern}
      name={name}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={onFocus}
      readOnly={readOnly}
      required={required}
      ref={forwardedRef}
      {...rest}
    />
  );
});

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  children: string;
  htmlFor: string;
}

InputBox.Label = function InputBox__Label({ children, htmlFor }: LabelProps) {
  return (
    <label className={s.label} htmlFor={htmlFor}>
      {children}
    </label>
  );
};
