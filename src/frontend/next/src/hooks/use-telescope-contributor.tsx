import { useState, useEffect } from 'react';

interface contributorsState {
  login: string;
  id: number;
  nodeID: string;
  avatarUrl: string;
  gravatarID: string;
  url: string;
  htmlUrl: string;
  followersUrl: string;
  followingUrl: string;
  gistsUrl: string;
  starredUrl: string;
  subscriptionsUrl: string;
  organizationsUrl: string;
  reposUrl: string;
  eventsUrl: string;
  receivedEventsUrl: string;
  type: string;
  siteAdmin: boolean;
  contributions: number;
}

const pickRandomContributor = (contributors: contributorsState[]) => {
  return contributors[Math.floor(Math.random() * contributors.length)];
};

const useTelescopeContributor = () => {
  const [contributor, setContributor] = useState<contributorsState | null>(null);
  const [error, setError] = useState<null>(null);
  const telescopeGitHubContributorsUrl =
    'https://api.github.com/repos/Seneca-CDOT/telescope/contributors';

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(telescopeGitHubContributorsUrl);
        if (!response.ok) {
          throw new Error('GitHub API response not OK');
        }

        const contributors: contributorsState[] = await response.json();
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
