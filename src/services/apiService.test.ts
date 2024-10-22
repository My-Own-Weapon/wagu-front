/* eslint-disable max-classes-per-file */

import ApiService from '@/services/apiService';

describe('fetcher', () => {
  const SERVER_ERROR = {
    status: 400,
    message: '서버에서 반환해주는 에러메세지에용',
    error: 'Internal Server Error',
  };

  let apiService: ApiService;
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    apiService = new ApiService();
    mockFetch.mockClear();
  });

  beforeEach(() => {
    // 모든 테스트에서 공통적으로 사용할 실패 응답 설정
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(SERVER_ERROR),
    });
  });

  it('errorConfig가 없으면 서버 메시지를 사용한다', async () => {
    await expect(
      apiService.fetcher('/test', { method: 'GET' }),
    ).rejects.toThrow(SERVER_ERROR.message);
  });

  it('errorConfig가 문자열이면 해당 문자열을 에러 메시지로 사용한다', async () => {
    const CUSTOM_ERROR_MESSAGE = 'Custom Error Message';

    await expect(
      apiService.fetcher('/test', { method: 'GET' }, CUSTOM_ERROR_MESSAGE),
    ).rejects.toThrow(CUSTOM_ERROR_MESSAGE);
  });

  it('errorConfig가 객체일때 CutomError가 존재하지않고 custom message를 전달했을때 custom message를 포함한 단순 Error를 반환한다.', async () => {
    const customMessage = 'Custom Error Message';

    await expect(
      apiService.fetcher(
        '/test',
        { method: 'GET' },
        { errorMessage: customMessage },
      ),
    ).rejects.toThrow(customMessage);
  });

  it('errorConfig가 객체일때 CustomError가 존재하고 custom message가 없으면 server message를 사용한다.', async () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }

    await expect(
      apiService.fetcher('/test', { method: 'GET' }, { CustomError }),
    ).rejects.toMatchObject({
      name: 'CustomError',
      message: expect.stringContaining(SERVER_ERROR.message),
    });
  });

  it('errorConfig가 객체일때 CustomError와 custom message 모두 있으면 둘 다 사용한다', async () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }
    const CUSTOM_MESSAGE = 'Custom Error Message';

    await expect(
      apiService.fetcher(
        '/test',
        { method: 'GET' },
        { CustomError, errorMessage: CUSTOM_MESSAGE },
      ),
    ).rejects.toMatchObject({
      name: 'CustomError',
      message: expect.stringContaining(CUSTOM_MESSAGE),
    });
  });
});
