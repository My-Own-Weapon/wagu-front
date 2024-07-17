import { LoginUserInputs, SignupDetails } from '@/types';

class ApiService {
  private mswBaseUrl = 'http://localhost:9090';

  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  private kakaoBaseUrl =
    'https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&query=';

  private sessionId = '';

  async login({ username, password }: LoginUserInputs) {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const data = await res.text();

    return data;
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

    return res.text();
  }

  async checkSession() {
    const res = await fetch(`${this.baseUrl}/session`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, error } = await res.json();

      throw new Error(
        `[${status}: ${error}] 세션이 만료되었습니다. 다시 로그인해주세요`,
      );
    }

    return res.text();
  }

  async fetchPosts() {
    const res = await fetch(`${this.baseUrl}/posts`, {
      method: 'GET',
      credentials: 'include',
    });

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

  async fetchFollowings() {
    const res = await fetch(`${this.baseUrl}/followings`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
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

  async fetchPostsOfStore(storeId: number) {
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
}

export const apiService = new ApiService();
