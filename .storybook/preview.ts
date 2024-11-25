import type { Preview } from '@storybook/react';

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

import '../src/styles/reset.css';

const preview: Preview = {
  parameters: {
    docs: {
      story: {
        height: '300px',
      },
    },
    viewport: {
      viewports: {
        small: {
          name: 'wagu-book 개발 환경 (small)',
          styles: {
            width: '410px',
            height: '100dvh',
          },
        },
        ...MINIMAL_VIEWPORTS,
      },
      defaultViewport: 'small',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
