/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
// import { createMiddleware } from '@mswjs/http-middleware';
import { createMiddleware } from './createMiddleware';
import { handlers } from './handlers';

const app = express();
const port = 9090;

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

/** for multipart/form-data
 * @see https://github.com/mswjs/http-middleware/pull/39
 */
app.use(express.raw({ type: '*/*', limit: '10mb' }));
app.use(createMiddleware(...handlers));
app.listen(port, () => console.log(`Mock server is running on port: ${port}`));
