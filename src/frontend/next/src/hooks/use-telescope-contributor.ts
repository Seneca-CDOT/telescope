import { useState, useEffect } from 'react';
import useSWR from 'swr';

const telescopeGitHubContributorsUrl =
  'https://api.github.com/repos/Seneca-CDOT/telescope/contributors';

const randomContributor = (contributors?: []) =>
  contributors ? contributors[Math.floor(Math.random() * contributors.length)] : null;

const useTelescopeContributor = () => {
  const { data, error } = useSWR(telescopeGitHubContributorsUrl);
  const [contributor, setContributor] = useState<Object | null>(data);

  useEffect(() => {
    setContributor(randomContributor(data));
  }, [data]);

  return { contributor, error };
};

export default useTelescopeContributor;
