/* eslint-disable class-methods-use-this */

'use client';

class LocalStorage {
  private NAME = 'fullName';
  private USERNAME = 'useName';
  private PROFILE_IMAGE = 'profileImage';

  private saveGet(key: string) {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(key);
  }

  private saveSet(key: string, value: string) {
    if (typeof window === 'undefined') return;

    localStorage.setItem(key, value);
  }

  getUserName() {
    return this.saveGet(this.USERNAME);
  }

  setUserName(name: string) {
    this.saveSet(this.USERNAME, name);
  }

  getName() {
    return this.saveGet(this.NAME);
  }

  setName(name: string) {
    this.saveSet(this.NAME, name);
  }

  getProfileImage() {
    return this.saveGet(this.PROFILE_IMAGE);
  }

  setProfileImage(profileImage: string) {
    this.saveSet(this.PROFILE_IMAGE, profileImage);
  }
}

export const localStorageApi = new LocalStorage();
