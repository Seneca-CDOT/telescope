import { useContext } from 'react';
import { GithubInfoContext, GithubInfoContextInterface } from '../components/GithubInfoProvider';

const useGithubInfo = (): GithubInfoContextInterface => useContext(GithubInfoContext);

export default useGithubInfo;
