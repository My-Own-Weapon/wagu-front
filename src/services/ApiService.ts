class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  private accessToken = '';

  async signup(formData: FormData) {
    const res = await fetch(`${this.baseUrl}/api/users`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    return res;
  }

  async fetchPosts() {
    const res = await fetch(`${this.baseUrl}/api/allPosts`, {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  }
}

// eslint-disable-next-line import/prefer-default-export
export const apiService = new ApiService();
