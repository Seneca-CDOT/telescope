import { useContext } from 'react';
import { GitHubInfoContextInterface } from '../components/GitHubInfo';
import { YouTubeInfoContextInterface } from '../components/YouTubeInfo';
import { GenericInfoContext } from '../components/GenericInfoProvider';

export const useGithubInfo = (): GitHubInfoContextInterface =>
  useContext(GenericInfoContext).gitHubInfo;
export const useYouTubeInfo = (): YouTubeInfoContextInterface =>
  useContext(GenericInfoContext).youTubeInfo;
