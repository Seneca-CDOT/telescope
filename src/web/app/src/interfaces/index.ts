export type Feed = {
  id: string;
  author: string;
  url: string;
  link: string;
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

export type ThemeName = 'light' | 'dark';
