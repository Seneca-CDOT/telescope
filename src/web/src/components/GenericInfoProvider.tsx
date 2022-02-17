import { createContext, useMemo, ReactNode } from 'react';
import { Post } from '../interfaces';
import { GitHubInfoContextInterface, extractGitHubInfo } from './GitHubInfo';

type GenericInfoContextInterface = {
  gitHubInfo: GitHubInfoContextInterface;
};

const GenericInfoContext = createContext<GenericInfoContextInterface>({
  gitHubInfo: {
    issues: [],
    pullRequests: [],
    repos: [],
    commits: [],
    users: [],
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
    };
  }, [post]);

  return <GenericInfoContext.Provider value={genericInfo}>{children}</GenericInfoContext.Provider>;
};

export default GenericInfoProvider;
export { GenericInfoContext };
