import { useState, useEffect } from 'react';
import { Endpoints } from '@octokit/types';
import useSWR from 'swr';

type listContributorsResponse = Endpoints['GET /repos/{owner}/{repo}/contributors'];

const telescopeGitHubContributorsUrl =
  'https://api.github.com/repos/Seneca-CDOT/telescope/contributors';

const pickRandomContributor = (contributors?: []) => {
  return contributors ? contributors[Math.floor(Math.random() * contributors.length)] : null;
};

const useTelescopeContributor = () => {
  const { data, error } = useSWR(telescopeGitHubContributorsUrl);
  const [contributor, setContributor] = useState<Object | null>(data);

  useEffect(() => {
    setContributor(pickRandomContributor(data));
  }, [data]);

  return { contributor, error };
};

export default useTelescopeContributor;
