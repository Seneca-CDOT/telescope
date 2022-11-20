const LIGHT_DEFAULT = 'light-default';
const LIGHT_HIGH_CONTRAST = 'light-high-contrast';
const DARK_DEFAULT = 'dark-default';
const DARK_DIM = 'dark-dim';

export type Feed = {
  id: string;
  author: string;
  url: string;
  link: string;
  githubUsername: string;
};

export type Post = {
  feed: Feed;
  id: string;
  guid: string;
  post: string;
  title: string;
  updated: string;
  url: string;
  html: string;
  type: 'blogpost' | 'video';
};

export type FeedType = 'blog' | 'youtube' | 'twitch';

export type DiscoveredFeed = { feedUrl: string; type: FeedType };

export type DiscoveredFeeds = { feedUrls: DiscoveredFeed[] };

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
  channelUrl: string;
  blogs: DiscoveredFeed[];
  allBlogs: DiscoveredFeed[];
  channels: DiscoveredFeed[];
  allChannels: DiscoveredFeed[];
  blogOwnership: boolean;
  channelOwnership: boolean;
};

export type ThemeName = 'light-default' | 'light-high-contrast' | 'dark-default' | 'dark-dim';

export type Theme = {
  title: string;
  id: ThemeName;
  image: string;
};

export { LIGHT_DEFAULT, LIGHT_HIGH_CONTRAST, DARK_DEFAULT, DARK_DIM };
