import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import type { RequestHandler as ExpressMiddleware } from 'express';
import type { LifeCycleEventsMap, RequestHandler } from 'msw';
import { handleRequest } from 'msw';
import { Emitter } from 'strict-event-emitter';
import * as streamWeb from 'node:stream/web';

/*
 * INSPIRED BY:
 * - https://github.com/mswjs/http-middleware
 * - https://github.com/mswjs/http-middleware/pull/39
 *
 * ⛔️ msw에서 multipart Formdata를 다룰때 발생하는 에러를 해결하기 위해 사용되는 middleware입니다.
 *    추후 msw에서 multipart Formdata를 지원하면 삭제해야 합니다.
 *    current version: 2.3.1
 */
type THeadersInit = [string, string][] | Record<string, string> | Headers;

const emitter = new Emitter<LifeCycleEventsMap>();

export function createMiddleware(
  ...handlers: RequestHandler[]
): ExpressMiddleware {
  return (req, res, next) => {
    const protocol = req.protocol || 'https';
    const origin = req.get('origin');
    const host = req.get('host');

    const baseUrl = origin || (host ? `${protocol}://${host}` : '/');

    const method = req.method || 'GET';

    const mockedRequest = new Request(
      // TREAT ALL RELATIVE URLS AS THE ONES COMING FROM THE SERVER
      new URL(req.url, baseUrl),
      {
        method,
        headers: new Headers(req.headers as THeadersInit),
        credentials: 'omit',
        // REQUEST WITH GET/HEAD METHOD CANNOT HAVE BODY
        body: ['GET', 'HEAD'].includes(method)
          ? undefined
          : (req.body as globalThis.BodyInit),
      },
    );

    handleRequest(
      mockedRequest,
      randomUUID(),
      handlers,
      {
        onUnhandledRequest: () => null,
      },
      emitter,
      {
        resolutionContext: {
          /*
           * RESOLVE RELATIVE REQUEST HANDLER URLs AGAINST
           * THE SERVER'S ORIGIN (NO RELATIVE URLs IN Node.js).
           */
          baseUrl,
        },

        onMockedResponse: (mockedResponse) => {
          const { status, statusText, headers } = mockedResponse;

          res.statusCode = status;
          res.statusMessage = statusText;

          headers.forEach((value, name) => {
            /*
             * USE `.appendHeader()` TO SUPPORT multi-value
             * RESPONSE HEADERS, LIKE "Set-Cookie".
             */
            res.appendHeader(name, value);
          });

          if (mockedResponse.body) {
            const stream = Readable.fromWeb(
              mockedResponse.body as streamWeb.ReadableStream,
            );

            stream.pipe(res);
          } else {
            res.end();
          }
        },

        onPassthroughResponse() {
          next();
        },
      },
    ).catch(next);
  };
}
