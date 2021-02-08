export interface User {
  isLoggedIn: boolean;
}

export interface AuthenticatedUser extends User {
  name: string;
  email: string;
  id: string;
  isAdmin: boolean;
  isLoggedIn: true;
}

export interface AdminUser extends AuthenticatedUser {
  isAdmin: true;
}

export type Feed = {
  id: string;
  author: string;
  url: string;
};

export type FeedHash = {
  [key: string]: {
    author: string;
    url: string;
  };
};

export type Post = {
  feed: Feed;
  id: string;
  post: string;
  title: string;
  updated: string;
  url: string;
  html: string;
};

export type ThemeName = 'light' | 'dark';
