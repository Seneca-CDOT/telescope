import React from 'react';

import { Container } from '@material-ui/core';
import PageBase from './PageBase';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import ScrollToTop from '../components/ScrollToTop';

export default function IndexPage() {
  return (
    <PageBase title="Home">
      <Banner />
      <ScrollToTop />
      <Container className="main">
        <Posts />
      </Container>
    </PageBase>
  );
}
