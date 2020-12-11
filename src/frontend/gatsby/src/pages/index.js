import React from 'react';

import PageBase from './PageBase';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import BackToTopButton from '../components/BackToTopButton';

export default function IndexPage() {
  return (
    <PageBase title="Home">
      <Banner />
      <BackToTopButton />
      <main className="main">
        <Posts />
      </main>
    </PageBase>
  );
}
