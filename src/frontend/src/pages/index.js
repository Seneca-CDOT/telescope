import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import Layout from '../components/Layout/Layout';
import './index.css';

export default function IndexPage() {
  return (
    <StaticQuery
      query={graphql`
        query TelescopeUrl {
          site(buildTime: {}) {
            siteMetadata {
              telescopeUrl
            }
          }
        }
      `}
      render={data => <Layout telescopeUrl={data.site.siteMetadata.telescopeUrl} />}
    />
  );
}
