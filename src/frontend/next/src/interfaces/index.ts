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
