'use client';

class LocalStorage {
  private USERNAME = 'username';

  getUserName() {
    return localStorage.getItem(this.USERNAME);
  }

  setUserName(name: string) {
    localStorage.setItem(this.USERNAME, name);
  }
}

export const localStorageApi = new LocalStorage();
