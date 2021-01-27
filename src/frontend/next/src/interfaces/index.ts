export type User = {
  name?: string;
  email?: string;
  id?: string;
  isAdmin?: boolean;
  isLoggedIn: boolean;
};

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
