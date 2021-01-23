export type User = {
  name?: string;
  email?: string;
  id?: string;
  isAdmin?: boolean;
  isLoggedIn: boolean;
};

export type Feed = {
  id: number;
  author: string;
  url: string;
};

export type FeedHash = {
  [key: number]: {
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
