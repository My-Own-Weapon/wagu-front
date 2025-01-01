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
  useRef,
  useLayoutEffect,
  useState,
} from 'react';

import { Stack, Flex } from '@/components/layout';
import Text from '@/components/ui-kit/Text';

import s from './index.module.scss';

interface InputBoxContextValue {
  id: string;
  isError: boolean;
  errorMessage?: string;
  $inputBoxWrapperRef: React.RefObject<HTMLDivElement>;
}

const InputBoxContext = createContext<InputBoxContextValue | undefined>(
  undefined,
);
export const useInputBoxContext = () => {
  const context = useContext(InputBoxContext);
  if (!context) {
    throw new Error('InputBoxContext must be used within an InputBox');
  }
  return context;
};

interface InputBox__RootProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  errorMessage?: string;
}

export default function InputBox({
  children,
  errorMessage = undefined,
  style = {},
  ...rest
}: InputBox__RootProps) {
  const id = useId();
  const isError = !!errorMessage;
  const $inputBoxWrapperRef = useRef<HTMLDivElement | null>(null);
  const contextValue: InputBoxContextValue = useMemo(
    () => ({
      id,
      isError,
      errorMessage,
      $inputBoxWrapperRef,
    }),
    [id, isError, errorMessage, $inputBoxWrapperRef],
  );

  return (
    <InputBoxContext.Provider value={contextValue}>
      <div style={{ position: 'relative' }} ref={$inputBoxWrapperRef}>
        <Stack style={{ ...style, width: '100%', gap: '8px' }} {...rest}>
          {children}
          {isError && <InputBox.ErrorMessage />}
        </Stack>
      </div>
    </InputBoxContext.Provider>
  );
}

interface InputBox__InputProps extends ComponentPropsWithoutRef<'input'> {
  width?: string;
  height?: 48 | 56;
  type?: 'text' | 'number' | 'password' | 'tel';
}

InputBox.Input = forwardRef(function InputBox__Input(
  {
    width = '100%',
    height = 56,
    type = 'text',
    onChange = undefined,
    ...rest
  }: InputBox__InputProps,
  forwardedRef: React.Ref<HTMLInputElement>,
) {
  const { id, isError } = useInputBoxContext();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!onChange) return;

    onChange(event);
  };

  return (
    <input
      id={id}
      className={s.inputBox}
      style={{
        position: 'relative',
        width,
        height,
        borderBottomColor: isError ? '#e42939' : undefined,
      }}
      type={type}
      onChange={handleChange}
      ref={forwardedRef}
      {...rest}
    />
  );
});

interface InputBox__LabelProps extends ComponentPropsWithoutRef<'label'> {
  children: string;
}

InputBox.Label = function InputBox__Label({ children }: InputBox__LabelProps) {
  const { id, isError } = useInputBoxContext();

  return (
    <label
      htmlFor={id}
      className={s.label}
      style={{
        color: isError ? '#e42939' : undefined,
      }}
    >
      {children}
    </label>
  );
};

InputBox.ErrorMessage = function InputBox__ErrorMessage() {
  const { errorMessage, $inputBoxWrapperRef } = useInputBoxContext();
  const [offsetY, setOffsetY] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if ($inputBoxWrapperRef.current) {
      const { height } = $inputBoxWrapperRef.current.getBoundingClientRect();

      setOffsetY(height);
    }
  }, [$inputBoxWrapperRef]);

  return (
    <ErrorMessage role="alert" offsetY={offsetY}>
      {errorMessage}
    </ErrorMessage>
  );
};

interface Props {
  align?: 'left' | 'center';
  role?: 'alert';
  offsetY?: number;
  children: ReactNode;
}

export function ErrorMessage({
  align = 'left',
  role = 'alert',
  offsetY = undefined,
  children,
}: Props) {
  return (
    <Flex
      justifyContent={align === 'left' ? 'flex-start' : 'center'}
      style={{
        position: offsetY ? 'absolute' : undefined,
        top: offsetY ? offsetY - 16 : undefined,
      }}
    >
      <Text as="p" fontSize="small" fontWeight="medium" color="red" role={role}>
        {children}
      </Text>
    </Flex>
  );
}
