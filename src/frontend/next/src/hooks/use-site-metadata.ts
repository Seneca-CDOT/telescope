/**
 * Custom hook to get static site metadata, for use in compontents.
 *
 * See https://www.gatsbyjs.org/docs/use-static-query/
 */

// import { useStaticQuery, graphql } from 'gatsby';

// const useSiteMetadata = () => {
//   const { site } = useStaticQuery(
//     graphql`
//       query SiteMetaData {
//         site {
//           siteMetadata {
//             title
//             description
//             author
//             telescopeUrl
//           }
//         }
//       }
//     `
//   );
//   return site.siteMetadata;
// };

import { gql, useQuery } from '@apollo/client';

const useSiteMetadata = () => {
  const { site }: any = useQuery(gql`
    query SiteMetaData {
      site {
        siteMetadata {
          title
          description
          author
          telescopeUrl
        }
      }
    }
  `);
  return site.siteMetadata;
};

export default useSiteMetadata;
