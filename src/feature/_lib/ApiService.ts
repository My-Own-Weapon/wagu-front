import { z } from 'zod';

type PathMustStartWithSlash<T extends string> = T extends `/${string}`
  ? T
  : never;
type CustomErrorConstructor = new (message: string) => Error;
const ConfigSchema = z
  .union([
    z.string(),
    z.object({
      CustomError: z
        .custom<CustomErrorConstructor>((error) => {
          return (
            typeof error === 'function' && error.toString().startsWith('class')
          );
        })
        .optional(),
      errorMessage: z.string().optional(),
      url: z.string().optional(),
    }),
  ])
  .optional();
type CustomUrlOrErrorConfig = z.infer<typeof ConfigSchema>;

export default abstract class ApiService {
  private readonly mswBaseUrl = 'http://localhost:9090';
  private readonly baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : this.mswBaseUrl;

  /**
   * @example
   * const res = awiat this.fetcher('/posts', {
   *   method: 'GET',
   *   credentials: 'include',
   * },
   * 'Failed to fetch posts');
   *
   * const res = awiat this.fetcher('/posts', {
   *   method: 'GET',
   *   credentials: 'include',
   *  },
   *  {
   *   CustomError : FetchPostsError,
   *   errorMessage: 'Failed to fetch posts',
   * });
   *
   * const res = awiat this.fetcher('/posts', {
   *   method: 'GET',
   *   credentials: 'include',
   *  },
   *  {
   *   errorMessage: 'Failed to fetch posts',
   * });
   */
  protected async fetcher<T extends string>(
    path: PathMustStartWithSlash<T>,
    requestInit: globalThis.RequestInit,
    config?: CustomUrlOrErrorConfig,
  ): Promise<Response> {
    if (!path.startsWith('/')) {
      throw new Error('path must start with /');
    }
    const url =
      typeof config === 'object' && config?.url ? config.url : this.baseUrl;
    const res = await fetch(`${url}${path}`, requestInit);

    if (!res.ok) {
      const { status, message, error } = await res.json();

      if (!config) {
        console.error(`${path} 에러 발생`);
        throw new Error(this.errorMessageTemplate({ status, error, message }));
      }

      const validatedErrorConfig = ConfigSchema.parse(config);
      if (validatedErrorConfig) {
        const errorMessage = this.createErrorMessage(
          validatedErrorConfig,
          status,
          error,
          message,
        );

        // eslint-disable-next-line max-depth
        if (
          typeof validatedErrorConfig === 'object' &&
          validatedErrorConfig.CustomError
        ) {
          throw new validatedErrorConfig.CustomError(errorMessage);
        }

        throw new Error(errorMessage);
      }

      throw new Error(this.errorMessageTemplate({ status, error, message }));
    }

    return res;
  }

  protected createErrorMessage(
    errorConfig: NonNullable<CustomUrlOrErrorConfig>,
    status: number,
    error: string,
    serverMessage: string,
  ): string {
    const message =
      typeof errorConfig === 'string'
        ? errorConfig
        : (errorConfig.errorMessage ?? serverMessage);

    return this.errorMessageTemplate({ status, error, message });
  }

  // eslint-disable-next-line class-methods-use-this
  protected errorMessageTemplate({
    status,
    error,
    message,
  }: {
    status: number;
    error: string;
    message: string;
  }) {
    return `[${status}] ${error}\n Message - ${message}`;
  }
}
