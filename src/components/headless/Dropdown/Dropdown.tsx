/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { zIndex } from '@/constants/theme';

const DropdownContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  $trigger: React.RefObject<HTMLButtonElement>;
} | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
};

function Dropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const $trigger = useRef<HTMLButtonElement>(null);

  const value = useMemo(() => ({ isOpen, setIsOpen, $trigger }), [isOpen]);

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
}

Dropdown.Trigger = function Dropdown__Trigger({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setIsOpen, $trigger } = useDropdownContext();

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Enter' || e.key === ' ') {
      console.log('keydown');
      setIsOpen(true);
    }
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isOpen && $trigger.current?.contains(e.target as Node)) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  };

  return (
    <button
      ref={$trigger}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      data-testid="dropdown-trigger"
      {...props}
    >
      {children}
    </button>
  );
};

Dropdown.Portal = function Dropdown__Portal({
  offsetX = 0,
  offsetY = 0,
  children,
}: {
  offsetX?: number;
  offsetY?: number;
  children: React.ReactNode;
}) {
  const { isOpen, $trigger } = useDropdownContext();
  const [positionStyles, setPositionStyles] = useState({});
  const [portalContainer] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(portalContainer);
    return () => {
      document.body.removeChild(portalContainer);
    };
  }, [portalContainer]);

  useEffect(() => {
    if (isOpen && $trigger.current) {
      const triggerRect = $trigger.current.getBoundingClientRect();

      setPositionStyles({
        position: 'absolute',
        top: `${triggerRect.bottom + window.scrollY + offsetY}px`,
        left: `${triggerRect.left + window.scrollX + offsetX}px`,
        zIndex: zIndex.dropDown,
      });
    }
  }, [isOpen, $trigger, offsetX, offsetY]);

  if (!isOpen) return null;

  return <div style={positionStyles}>{children}</div>;
};

Dropdown.Content = function Dropdown__Content({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setIsOpen, $trigger } = useDropdownContext();
  const $content = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        $content.current &&
        !$content.current.contains(e.target as Node) &&
        !$trigger.current?.contains(e.target as Node)
      ) {
        console.log('content click outside');
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      $content.current?.focus();
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (
    event,
  ) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ul
      ref={$content}
      role="menu"
      /** focus되지 않도록
       * @see https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation-and-the-tabindex-attribute
       */
      tabIndex={-1}
      data-testid="dropdown-content"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </ul>
  );
};

Dropdown.Item = function Dropdown__Item({
  children,
  onSelect = undefined,
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  onSelect?: React.MouseEventHandler<HTMLLIElement>;
  disabled?: boolean;
}) {
  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (!onSelect) return;
    if (disabled) {
      event.preventDefault();
      return;
    }

    onSelect(event);
  };

  return (
    <li
      role="menuitem"
      /* disabled 시 focus 되지 않도록 */
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </li>
  );
};

Dropdown.Group = function Dropdown__Group({
  children,
  label,
  ...props
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} {...props}>
      {children}
    </div>
  );
};

Dropdown.Label = function Dropdown__Label({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <span role="presentation" tabIndex={-1} {...props}>
      {children}
    </span>
  );
};

export default Dropdown;
