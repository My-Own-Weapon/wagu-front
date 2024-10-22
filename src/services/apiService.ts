// eslint-disable-next-line max-classes-per-file
import {
  AddressSearchDetails,
  LoginUserInputs,
  MapVertexes,
  ProfileWithoutFollowResponse,
  SignupDetails,
  StoreResponse,
  VotedStoreResponse,
} from '@/types';
import CheckLoginSessionError from '@/services/errors/CheckLoginSessionError';
import { ERROR_MESSAGE } from '@/services/constants/errorMessage';
import { z } from 'zod';

interface ProfileDetailsResponse {
  userName: string;
  profileImage: string;
  followerNum: number;
  followingNum: number;
  postNum: number;
}

interface ShareMapPublishSessionResponse {
  memberId: number;
  sessionId: string;
}

interface AIAutoReviewResponse {
  menuContent: string;
}

type SuccessMessageResponse = Promise<string>;

type PathMustStartWithSlash<T extends string> = T extends `/${string}`
  ? T
  : never;

type CustomErrorConstructor = new (message: string) => Error;

// Zod 스키마 정의
const ErrorConfigSchema = z
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
    }),
  ])
  .optional();

type ErrorConfig = z.infer<typeof ErrorConfigSchema>;
export default class ApiService {
  private mswBaseUrl = 'http://localhost:9090';

  private baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : this.mswBaseUrl;

  private kakaoBaseUrl =
    'https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&query=';

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
  async fetcher<T extends string>(
    path: PathMustStartWithSlash<T>,
    requestInit: globalThis.RequestInit,
    errorConfig?: ErrorConfig,
  ): Promise<Response> {
    if (!path.startsWith('/')) {
      throw new Error('path must start with /');
    }

    const res = await fetch(`${this.baseUrl}${path}`, requestInit);

    if (!res.ok) {
      const { status, message, error } = await res.json();

      if (!errorConfig) {
        throw new Error(this.errorMessageTemplate({ status, error, message }));
      }

      const validatedErrorConfig = ErrorConfigSchema.parse(errorConfig);
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

  private createErrorMessage(
    errorConfig: NonNullable<ErrorConfig>,
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
  private errorMessageTemplate({
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

  /* Auth */
  async login({ username, password }: LoginUserInputs) {
    const res = await this.fetcher(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      const data = await res.json();
      const { status, message, error } = data;

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async logout() {
    const res = await fetch(`${this.baseUrl}/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async signup({
    username,
    password,
    passwordConfirm,
    name,
    phoneNumber,
  }: SignupDetails) {
    const res = await fetch(`${this.baseUrl}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        passwordConfirm,
        name,
        phoneNumber,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      const { status, message, error } = data;

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  public async checkLoginSession() {
    const res = await this.fetcher(
      '/session',
      {
        method: 'GET',
        credentials: 'include',
      },
      {
        CustomError: CheckLoginSessionError,
        errorMessage: ERROR_MESSAGE.CHECK_LOGIN_SESSION,
      },
    );

    return res.text();
  }

  /* about User */
  async fetchProfileDetails(memberId: number): Promise<ProfileDetailsResponse> {
    const res = await fetch(`${this.baseUrl}/member/${memberId}/profile`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  async fetchProfileWithoutFollow(
    userName: string,
  ): Promise<ProfileWithoutFollowResponse> {
    const res = await fetch(`${this.baseUrl}/member/${userName}/profile`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const profile = await res.json();

    return profile;
  }

  async fetchFollowings() {
    const res = await fetch(`${this.baseUrl}/followings`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }

  async followUser(memberId: number) {
    const res = await fetch(`${this.baseUrl}/members/${memberId}/follow`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async unFollowUser(memberId: number) {
    const res = await fetch(`${this.baseUrl}/members/${memberId}/follow`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async searchUsers(username: string) {
    const res = await fetch(
      `${this.baseUrl}/members?username=${username}&page=0&size=12`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  /* about Post */
  async fetchPosts({
    page = 0,
    count = 12,
  }: {
    page?: number;
    count?: number;
  }) {
    const res = await fetch(
      `${this.baseUrl}/posts?2page=${page}&size=${count}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  async fetchPost(postId: string) {
    const res = await fetch(`${this.baseUrl}/posts/${postId}`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }

  async addPost(formData: FormData) {
    const res = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    /* ✅ TODO: response 변경시 수정  */
    return res;
  }

  /* about Store */
  async fetchStorePosts(storeId: number | undefined) {
    const res = await fetch(
      `${this.baseUrl}/map/posts?storeId=${storeId}&page=0&size=12`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  async fetchStoreDetails(storeId: number) {
    const res = await fetch(`${this.baseUrl}/store/${storeId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  async searchStore(storeName: string) {
    const res = await fetch(
      `${this.baseUrl}/stores?keyword=${storeName}&page=0&size=12`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  async fetchOnLiveFollowingsAtStore(storeId: number | undefined) {
    const res = await fetch(`${this.baseUrl}/map/live?storeId=${storeId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const streamers = await res.json();

    return streamers;
  }

  async fetchKAKAOStoreInfo(name: string) {
    const url = `${this.kakaoBaseUrl}${encodeURIComponent(name)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK f117ced1de2bab59de8005c69892ed73`,
      },
    });
    const data = await res.json();

    return data;
  }

  /* about Live */
  async createSessionId({
    storeName,
    address,
    posx,
    posy,
  }: AddressSearchDetails) {
    const res = await fetch(`${this.baseUrl}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeLocation: {
          address,
          posx,
          posy,
        },
        storeName,
      }),
      credentials: 'include',
    });
    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const data = await res.json();

    return data;
  }

  async fetchStreamingToken(sessionId: string) {
    const res = await fetch(
      `${this.baseUrl}/api/sessions/${sessionId}/connections`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const data = await res.json();

    return data;
  }

  async fetchSessionCreator(sessionId: string) {
    const res = await fetch(
      `${this.baseUrl}/api/sessions/${sessionId}/creator`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }
    const data = await res.json();

    return data;
  }

  async removeLiveSession(sessionId: string) {
    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async checkIsStreamerUserOfSession(sessionId: string) {
    const res = await fetch(
      `${this.baseUrl}/api/sessions/${sessionId}/creator`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const data = await res.json();

    return data;
  }

  async fetchLiveFollowings() {
    const res = await fetch(`${this.baseUrl}/rooms/followings`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const data = await res.json();

    return data;
  }

  /* about map page */
  async fetchMapBoundaryStores({
    left,
    right,
    up,
    down,
  }: MapVertexes): Promise<StoreResponse[]> {
    const res = await fetch(
      `${this.baseUrl}/map?left=${left}&right=${right}&up=${up}&down=${down}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const stores = await res.json();

    return stores;
  }

  /* about Share Map page */
  async createShareMapRandomSessionId(): Promise<string> {
    const res = await this.fetcher(
      '/share',
      {
        method: 'POST',
        credentials: 'include',
      },
      {
        errorMessage: '함께 투표하기 방을 생성하는데 실패했습니다.',
      },
    );

    const sessionIdForShareUrl = await res.text();

    return sessionIdForShareUrl;
  }

  /** sessionId랑 매칭되는 sessionId를 가진 session을 생성하고 개시한다. */
  async publishShareMapSession(
    sessionId: string,
  ): Promise<ShareMapPublishSessionResponse> {
    const res = await fetch(`${this.baseUrl}/api/sessions/voice`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customSessionId: sessionId,
      }),
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  /* ----------------- about Vote ----------------- */

  /* [BEFORE 개표 (투표 List에 CRUD)] */
  async addStoreToVoteList(
    sessionId: string,
    storeId: string | number,
  ): SuccessMessageResponse {
    const res = await fetch(
      `${this.baseUrl}/share/${sessionId}?store_id=${storeId}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async fetchStoresInVoteList(
    sessionId: string,
  ): Promise<VotedStoreResponse[]> {
    const res = await fetch(`${this.baseUrl}/share/${sessionId}/vote/list`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const voteList = await res.json();

    return voteList;
  }

  async deleteStoreFromVoteList(sessionId: string, storeId: string) {
    const res = await fetch(
      `${this.baseUrl}/share/${sessionId}?store_id=${storeId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async fetchShareMapToken(sessionId: string) {
    const res = await fetch(
      `${this.baseUrl}/api/sessions/${sessionId}/connections/voice`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const { token } = await res.json();

    return token;
  }

  /* [AFTER 개표 (투표 LIST에 있는 선택지를 vote)] */
  async voteStore(sessionId: string, storeId: string): SuccessMessageResponse {
    const res = await fetch(
      `${this.baseUrl}/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async cancelVoteStore(sessionId: string, storeId: string) {
    const res = await fetch(
      `${this.baseUrl}/share/${sessionId}/vote?store_id=${storeId}`,
      {
        method: 'PATCH',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.text();
  }

  async fetchVoteResults(sessionId: string) {
    const res = await fetch(`${this.baseUrl}/share/${sessionId}/result`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  async fetchConnectionPeopleCount(sessionId: string): Promise<number> {
    const res = await fetch(
      `${this.baseUrl}/api/sessions/${sessionId}/connections`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }

  /* AI auto review */
  async fetchAIAutoReview({
    category,
    menuName,
  }: {
    category: string;
    menuName: string;
  }): Promise<AIAutoReviewResponse> {
    const res = await fetch(`${this.baseUrl}/posts/auto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postCategory: category,
        menuName,
      }),
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    return res.json();
  }
}

export const apiService = new ApiService();
