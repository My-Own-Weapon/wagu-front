import { LoginUserInputs, SignupDetails } from '@/types';

class ApiService {
  private baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:9090/api';

  private accessToken = '';

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

  async fetchPosts() {
    console.log(this.baseUrl);

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

  /* ✅ TODO 
    parameter로 데이터를 받도록 수정 또한, swagger에 맞게 param type 생성 */
  // async addPost(postData: AddPostProps) {
  async addPost() {
    const res = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postMainMenu: 'string',
        postImage: 'string',
        postContent: 'string',
        storeName: 'string',
        storeLocation: {
          address: 'string',
          posx: 0,
          posy: 0,
        },
        menus: [
          {
            menuName: 'string',
            menuPrice: 0,
            categoryName: 'string',
          },
        ],
        auto: true,
      }),
      credentials: 'include',
    });

    if (!res.ok) {
      const { status, message, error } = await res.json();

      throw new Error(`[${status}, ${error}] ${message}`);
    }

    const data = await res.text();

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchLiveFriends() {
    const res = await fetch(`${this.baseUrl}/liveFriends`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }
}

export const apiService = new ApiService();
