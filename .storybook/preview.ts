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
        ...MINIMAL_VIEWPORTS,
      },
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
