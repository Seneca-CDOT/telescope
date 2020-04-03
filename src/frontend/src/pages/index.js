import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import PageBase from './PageBase';
import Layout from '../components/Layout/Layout';

export default function IndexPage() {
  return (
    <PageBase>
      <StaticQuery
        query={graphql`
          query TelescopeUrl {
            site(buildTime: {}) {
              siteMetadata {
                telescopeUrl
                title
              }
            }
          }
        `}
        render={(data) => <Layout telescopeUrl={data.site.siteMetadata.telescopeUrl} />}
      />
    </PageBase>
  );
}
