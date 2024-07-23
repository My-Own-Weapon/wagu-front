'use client';

class LocalStorage {
  private NAME = 'name';

  private USERNAME = 'username';

  getUserName() {
    return localStorage.getItem(this.USERNAME);
  }

  setUserName(name: string) {
    localStorage.setItem(this.USERNAME, name);
  }

  getName() {
    return localStorage.getItem(this.NAME);
  }

  setName(name: string) {
    localStorage.setItem(this.NAME, name);
  }
}

export const localStorageApi = new LocalStorage();
