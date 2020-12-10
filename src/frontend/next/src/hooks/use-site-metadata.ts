/**
 * Custom hook to get static site metadata, for use in compontents.
 *
 * See https://www.gatsbyjs.org/docs/use-static-query/
 */

// takes a GraphQL query and returns your data
//  With Next.js, you get to choose which strategy you want (GraphQL is one supported option)
//import { useStaticQuery, graphql } from 'gatsby';
import { graphql } from 'graphql';

//If you export an async function called getStaticProps from a page, Next.js will pre-render
//this page at build time using the props returned by getStaticProps.

// https://github.com/benjaminpearson/next.js/blob/2e2c016eb535b400dc8c26411ea830a0b7e4dac9/examples/api-routes-apollo-server/pages/%5Busername%5D.js#L14
async function getStaticProps() {
  const { user = null } = await queryGraphql(
    `
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
    `
  );
  return { props: { user } };
}

export default getStaticProps;

// https://dev.to/ivanms1/next-js-graphql-typescript-setup-5bog
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

// export default useSiteMetadata;
