import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ModalPortalProvider } from '@/feature/_hooks/useModal/provider';
import InstallPrompt, { BeforeInstallPromptEvent } from './InstallPrompt';

const meta = {
  title: 'Common/Components/InstallPrompt',
  component: InstallPrompt,
  parameters: {
    layout: 'fullscreen',
    tags: ['autodocs'],
    docs: {
      description: {
        component:
          'PWA 설치를 유도하는 프롬프트 컴포넌트입니다. Docs가 아닌 Default 스토리에서 확인해야 합니다.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      setTimeout(() => {
        mockLocalStorage();
        mockBeforeInstallPrompt();
      }, 0);

      return (
        <div style={{ height: '400px' }}>
          <ModalPortalProvider>
            <Story />
          </ModalPortalProvider>
        </div>
      );
    },
  ],
} satisfies Meta<typeof InstallPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: fn(),
    setItem: fn(),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  return localStorageMock;
};

const mockBeforeInstallPrompt = () => {
  const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
  Object.defineProperties(event, {
    platforms: {
      value: ['web', 'android', 'ios'],
    },
    userChoice: {
      value: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
    },
    prompt: {
      value: () => Promise.resolve(),
    },
  });
  window.dispatchEvent(event);
};
