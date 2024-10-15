/* eslint-disable react/require-default-props */

'use client';

import React, {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useId,
  useImperativeHandle,
} from 'react';
import { useTextareaAutoResize } from '@/components/ui/TextareaBox/hooks/useTextareaAutoResize';
import Stack from '@/components/ui/Stack';

import s from './index.module.scss';

interface TextareaBoxProps {
  children: (id: string) => ReactNode;
}

export default function TextareaBox({ children }: TextareaBoxProps) {
  const id = useId();

  return <Stack>{children(id)}</Stack>;
}

interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  name: string;
  value?: string;
  onFocus?: () => void;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

TextareaBox.Textarea = forwardRef(function TextareaBox__Textarea(
  {
    name,
    value = undefined,
    onFocus = undefined,
    onChange = undefined,
    ...rest
  }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);
  const textareaRef = useTextareaAutoResize(value);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    if (!onChange) return;

    onChange(event);
  };

  return (
    <textarea
      ref={textareaRef}
      className={s.reviewInput}
      name={name}
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      {...rest}
    />
  );
});

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  htmlFor: string;
  children: string;
}

TextareaBox.Label = function TextareaBox__Label({
  children,
  htmlFor,
  ...rest
}: LabelProps) {
  return (
    <label className={s.label} htmlFor={htmlFor} {...rest}>
      {children}
    </label>
  );
};
