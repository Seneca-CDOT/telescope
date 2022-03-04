import { createContext, useMemo, ReactNode } from 'react';
import { Post } from '../interfaces';
import { GitHubInfoContextInterface, extractGitHubInfo } from './GitHubInfo';
import { YouTubeInfoContextInterface, extractYouTubeInfo } from './YouTubeInfo';

type GenericInfoContextInterface = {
  gitHubInfo: GitHubInfoContextInterface;
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
      gitHubInfo: extractGitHubInfo(post),
      youTubeInfo: extractYouTubeInfo(post),
    };
  }, [post]);

  return <GenericInfoContext.Provider value={genericInfo}>{children}</GenericInfoContext.Provider>;
};

export default GenericInfoProvider;
export { GenericInfoContext };
