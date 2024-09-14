/* eslint-disable react/require-default-props */

'use client';

import React, {
  ChangeEventHandler,
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';

import s from './index.module.scss';

interface TextareaBoxProps {
  children: (id: string) => ReactNode;
}

export default function TextareaBox({ children }: TextareaBoxProps) {
  const id = useId();

  return <div className={s.container}>{children(id)}</div>;
}

interface TextareaProps extends ComponentProps<'textarea'> {
  id?: string;
  placeholder?: string;
  value?: string;
  name: string;
  onFocus?: () => void;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  readOnly?: boolean;
  required?: boolean;
}

TextareaBox.Textarea = forwardRef(function TextareaBox__Textarea(
  {
    id = undefined,
    placeholder = undefined,
    name,
    value = '',
    onFocus = undefined,
    onChange = undefined,
    readOnly = false,
    required = false,
    ...rest
  }: TextareaProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  useEffect(() => {
    if (textareaRef.current) {
      /* auto로 갱신해줘야 글을 지웠을때 줄어듭니다. */
      const $textarea = textareaRef.current;
      $textarea.style.height = 'auto';
      $textarea.style.height = `calc(${$textarea.scrollHeight}px - 48px)`;
    }
  }, [value]);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    if (!onChange) return;

    onChange(event);
  };

  return (
    <div className={s.container}>
      <textarea
        ref={textareaRef}
        className={s.reviewInput}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={onFocus}
        readOnly={readOnly}
        required={required}
        {...rest}
      />
    </div>
  );
});

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  children: string;
  htmlFor: string;
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
