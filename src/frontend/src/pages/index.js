import React from 'react';

import PageBase from './PageBase';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import ScrollToTop from '../components/ScrollToTop';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function IndexPage() {
  return (
    <PageBase title="Home">
      <Banner />
      <ScrollToTop />
      <main className="main">
        <Posts />
      </main>
    </PageBase>
  );
}
