import { useContext } from 'react';
import { GitHubInfoContextInterface } from '../components/GitHubInfo';
import { GenericInfoContext } from '../components/GenericInfoProvider';

const useGithubInfo = (): GitHubInfoContextInterface => useContext(GenericInfoContext).gitHubInfo;

export default useGithubInfo;
