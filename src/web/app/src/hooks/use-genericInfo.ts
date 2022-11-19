import { useContext } from 'react';
import { GitHubInfo } from '@senecacdot/github-url-parser';

import { YouTubeInfoContextInterface } from '@components/YouTubeInfo';
import { GenericInfoContext } from '@components/GenericInfoProvider';

export const useGithubInfo = (): GitHubInfo => useContext(GenericInfoContext).gitHubInfo;
export const useYouTubeInfo = (): YouTubeInfoContextInterface =>
  useContext(GenericInfoContext).youTubeInfo;
