/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { useSWRInfinite } from 'swr';

export type Contributor = {
  avatar_url: string;
  html_url: string;
  login: string;
  contributions: number;
};

const telescopeGitHubContributorsUrl =
  'https://api.github.com/repos/Seneca-CDOT/telescope/contributors';

const randomContributor = (contributors?: any[]) =>
  contributors ? contributors[Math.floor(Math.random() * contributors.length)] : null;

const PER_PAGE: number = 50;

const useTelescopeContributor = () => {
  const [contributor, setContributor] = useState<Contributor | null>(null);

  const { data, error, size, setSize } = useSWRInfinite(
    (index: number) => `${telescopeGitHubContributorsUrl}?page=${index + 1}&per_page=${PER_PAGE}`
  );

  if (
    size > 0 &&
    typeof data?.[size - 1] !== 'undefined' &&
    data?.[data.length - 1]?.length === PER_PAGE
  ) {
    setSize(size + 1);
  }

  useEffect(() => {
    if (data && data?.[data.length - 1].length < PER_PAGE) {
      setContributor(randomContributor(data.flat()));
    }
  }, [data]);

  return { contributor, error };
};

export default useTelescopeContributor;
