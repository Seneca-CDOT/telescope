import { createContext, useMemo, ReactNode } from 'react';
import { parseGitHubUrls, GitHubInfo } from '@senecacdot/github-url-parser';

import { Post } from '@interfaces';
import { YouTubeInfoContextInterface, extractYouTubeInfo } from './YouTubeInfo';

type GenericInfoContextInterface = {
  gitHubInfo: GitHubInfo;
  youTubeInfo: YouTubeInfoContextInterface;
};

const GenericInfoContext = createContext<GenericInfoContextInterface>({
  gitHubInfo: {
    issues: [],
    pullRequests: [],
    repos: [],
    commits: [],
    users: [],
  },
  youTubeInfo: {
    channelUrl: '',
    subscriberCount: -1,
    viewCount: -1,
  },
});

type Props = {
  children: ReactNode;
  post: Post;
};

const GenericInfoProvider = ({ children, post }: Props) => {
  const genericInfo = useMemo(() => {
    return {
      gitHubInfo: parseGitHubUrls(post.html),
      youTubeInfo: extractYouTubeInfo(post),
    };
  }, [post]);

  return <GenericInfoContext.Provider value={genericInfo}>{children}</GenericInfoContext.Provider>;
};

export default GenericInfoProvider;
export { GenericInfoContext };
