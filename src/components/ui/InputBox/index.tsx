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
  createContext,
  useContext,
  useMemo,
} from 'react';

import { ErrorMessage } from '@/app/(auth)/_components';

import s from './index.module.scss';

interface InputBoxContextValue {
  id: string;
  error: boolean;
  errorMessage?: string;
}

const InputBoxContext = createContext<InputBoxContextValue | undefined>(
  undefined,
);

interface InputBoxProps {
  children: ReactNode;
  errorMessage?: string;
}

export default function InputBox({
  children,
  errorMessage = undefined,
}: InputBoxProps) {
  const id = useId();
  const error = !!errorMessage;
  const contextValue: InputBoxContextValue = useMemo(
    () => ({
      id,
      error,
      errorMessage,
    }),
    [id, error, errorMessage],
  );

  return (
    <InputBoxContext.Provider value={contextValue}>
      <div className={s.container}>
        {children}
        {errorMessage && <InputBox.ErrorMessage />}
      </div>
    </InputBoxContext.Provider>
  );
}

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  width?: string;
  height: 48 | 56;
  type?: 'text' | 'number' | 'password' | 'tel';
}

InputBox.Input = forwardRef(function InputBox__Input(
  { width = '100%', height = 56, type = 'text', ...rest }: InputProps,
  forwardedRef: React.Ref<HTMLInputElement>,
) {
  const context = useContext(InputBoxContext);
  if (!context) {
    throw new Error('InputBox.Input must be used within <InputBox />');
  }

  const { id, error } = context;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(rest.onChange);

    const { onChange } = rest;
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
        borderBottomColor: error ? '#e42939' : undefined,
      }}
      type={type}
      onChange={handleChange}
      ref={forwardedRef}
      {...rest}
    />
  );
});

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  children: string;
}

InputBox.Label = function InputBox__Label({ children }: LabelProps) {
  const context = useContext(InputBoxContext);
  if (!context) {
    throw new Error('InputBox.Label must be used within <InputBox />');
  }

  const { id, error } = context;

  return (
    <label
      className={s.label}
      style={{
        color: error ? '#e42939' : undefined,
      }}
      htmlFor={id}
    >
      {children}
    </label>
  );
};

InputBox.ErrorMessage = function InputBox__ErrorMessage() {
  const context = useContext(InputBoxContext);
  if (!context) {
    throw new Error('InputBox.ErrorMessage must be used within an InputBox');
  }

  const { errorMessage } = context;

  return <ErrorMessage role="alert">{errorMessage}</ErrorMessage>;
};
