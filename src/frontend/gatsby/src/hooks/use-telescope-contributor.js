import { useState, useEffect } from 'react';

const pickRandomContributor = (contributors) => {
  return contributors[Math.floor(Math.random() * contributors.length)];
};

const useTelescopeContributor = () => {
  const [contributor, setContributor] = useState(null);
  const [error, setError] = useState();
  const telescopeGitHubContributorsUrl =
    'https://api.github.com/repos/Seneca-CDOT/telescope/contributors';

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(telescopeGitHubContributorsUrl);
        if (!response.ok) {
          throw new Error('GitHub API response not OK');
        }

        const contributors = await response.json();
        setContributor(pickRandomContributor(contributors));
      } catch (err) {
        setError(err);
      }
    };
    fetchContributors();
  }, []);

  return { contributor, error };
};

export default useTelescopeContributor;
