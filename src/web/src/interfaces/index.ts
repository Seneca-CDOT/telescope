export type Feed = {
  id: string;
  author: string;
  url: string;
  link: string;
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
