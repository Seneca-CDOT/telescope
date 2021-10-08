/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import useSWR from 'swr';

export type Contributor = {
  avatar_url: string;
  html_url: string;
  login: string;
  contributions: number;
};

const telescopeGitHubContributorsUrl =
  'https://api.github.com/repos/Seneca-CDOT/telescope/contributors';

const prepareURL = (page?: number): string =>
  `${telescopeGitHubContributorsUrl}?per_page=1&${page ? `page=${page}` : ''}`;

const getPage = (links: string, rel: string): string | undefined => {
  // Header link is the form  '<...?per_page=1&page="page">; rel="key">', last page is also the contributors count
  const regex = new RegExp(`<[^?]+\\?per_page=1&[a-z]+=([\\d]+)>;[\\s]*rel="${rel}"`, 'g');
  const arr = regex.exec(links);
  return arr?.[1];
};

// We'll update github contributors count once every 30 days
const maxAge = 30 * 24 * 60 * 60 * 1000;

const useTelescopeContributor = () => {
  const [maxContributors, setMaxContributors] = useLocalStorage<number>(
    'github_contributors',
    undefined,
    {
      raw: true,
    }
  );
  const [fetchDate, setFetchDate] = useLocalStorage<number>('fetch_date', undefined, { raw: true });
  const [random, setRandom] = useState<number>(-1);

  const shouldUpdate = !maxContributors || !fetchDate || Date.now() - fetchDate >= maxAge;

  const { data: lastPage, error: countError } = useSWR(
    () => (shouldUpdate ? prepareURL() : null),
    async (url) => {
      const response = await fetch(url);
      const links = response.headers.get('Link') || '';
      return getPage(links, 'last');
    }
  );

  if (lastPage) {
    setMaxContributors(parseInt(lastPage, 10));
    setFetchDate(Date.now());
  }

  useEffect(() => {
    if (!shouldUpdate && maxContributors)
      setRandom(Math.floor(Math.random() * maxContributors + 1));
  }, [shouldUpdate, maxContributors]);

  // Github api returns an array of contributors [ {...} ]
  const { data: contributors, error: contributorError } = useSWR<Contributor[] | null>(
    () => (random !== -1 ? prepareURL(random) : null),
    (url: string) => fetch(url).then((res) => res.json())
  );

  const error = countError || contributorError || null;

  // The random contributor is the first in the array and the only contributor fetched
  return { contributor: contributors?.[0], error };
};

export default useTelescopeContributor;
