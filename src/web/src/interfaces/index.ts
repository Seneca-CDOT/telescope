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

export type SignUpForm = {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  github: {
    username: string;
    avatarUrl: string;
  };
  githubUsername: string;
  githubOwnership: boolean;
  blogUrl: string;
  feeds: Array<string>;
  blogOwnership: boolean;
};

export type ThemeName = 'light' | 'dark';
