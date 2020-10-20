import React from 'react';

import PageBase from './PageBase';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import ScrollToTop from '../components/ScrollToTop';
import useSiteMetaData from '../hooks/use-site-metadata';

export default function IndexPage() {
  const { telescopeUrl } = useSiteMetaData();

  return (
    <PageBase title="Home">
      <Banner />
      <ScrollToTop />
      <main className="main">
        <Posts telescopeUrl={telescopeUrl} />
      </main>
    </PageBase>
  );
}
