import { Post } from '../interfaces';

export interface YouTubeInfoContextInterface {
  channelUrl: string;
  subscriberCount: number;
  viewCount: number;
}

export const extractYouTubeInfo = (post: Post): YouTubeInfoContextInterface => {
  const youTubeInfo = {
    channelUrl: '',
    subscriberCount: -1,
    viewCount: -1,
  };

  if (post.type !== 'video') {
    return youTubeInfo;
  }

  youTubeInfo.channelUrl = post.feed.link;

  return youTubeInfo;
};
