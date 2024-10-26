/* eslint-disable @typescript-eslint/no-explicit-any */

import { paths } from './openApi';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

// '*/*' 래핑을 처리하는 타입
type UnwrapResponse<T> = T extends { '*/*': infer U } ? U : T;

type SuccessResponse<T> = T extends { responses: { 200: { content: infer R } } }
  ? UnwrapResponse<R>
  : never;

type ExtractMethodResponse<P, M extends HttpMethod> = P extends {
  [K in M]: infer R;
}
  ? SuccessResponse<R>
  : never;

export type ApiResponses = {
  [Path in keyof paths as paths[Path] extends {
    get?: any;
    post?: any;
    put?: any;
    delete?: any;
    patch?: any;
  }
    ? Path
    : never]: {
    GET: ExtractMethodResponse<paths[Path], 'get'>;
    POST: ExtractMethodResponse<paths[Path], 'post'>;
    PUT: ExtractMethodResponse<paths[Path], 'put'>;
    DELETE: ExtractMethodResponse<paths[Path], 'delete'>;
    PATCH: ExtractMethodResponse<paths[Path], 'patch'>;
  };
};

export type GetResponses = {
  [Path in keyof paths as paths[Path] extends { get: any }
    ? Path
    : never]: ExtractMethodResponse<paths[Path], 'get'>;
};

export type PostResponses = {
  [Path in keyof paths as paths[Path] extends { post: any }
    ? Path
    : never]: ExtractMethodResponse<paths[Path], 'post'>;
};

export type DeleteResponses = {
  [Path in keyof paths as paths[Path] extends { delete: any }
    ? Path
    : never]: ExtractMethodResponse<paths[Path], 'delete'>;
};

export type PatchResponses = {
  [Path in keyof paths as paths[Path] extends { patch: any }
    ? Path
    : never]: ExtractMethodResponse<paths[Path], 'patch'>;
};

type RequestBody<T> = T extends {
  requestBody: { content: { 'application/json': infer B } };
}
  ? B
  : never;

type ExtractMethodParams<P, M extends HttpMethod> = P extends {
  [K in M]: infer R;
}
  ? RequestBody<R>
  : never;

export type ApiParameters = {
  [Path in keyof paths as paths[Path] extends {
    get?: any;
    post?: any;
    put?: any;
    delete?: any;
    patch?: any;
  }
    ? Path
    : never]: {
    GET: ExtractMethodParams<paths[Path], 'get'>;
    POST: ExtractMethodParams<paths[Path], 'post'>;
    PUT: ExtractMethodParams<paths[Path], 'put'>;
    DELETE: ExtractMethodParams<paths[Path], 'delete'>;
    PATCH: ExtractMethodParams<paths[Path], 'patch'>;
  };
};

export type GetParameters = {
  [Path in keyof paths as paths[Path] extends { get: any }
    ? Path
    : never]: ExtractMethodParams<paths[Path], 'get'>;
};

export type PostParameters = {
  [Path in keyof paths as paths[Path] extends { post: any }
    ? Path
    : never]: ExtractMethodParams<paths[Path], 'post'>;
};

export type DeleteParameters = {
  [Path in keyof paths as paths[Path] extends { delete: any }
    ? Path
    : never]: ExtractMethodParams<paths[Path], 'delete'>;
};

export type PatchParameters = {
  [Path in keyof paths as paths[Path] extends { patch: any }
    ? Path
    : never]: ExtractMethodParams<paths[Path], 'patch'>;
};
