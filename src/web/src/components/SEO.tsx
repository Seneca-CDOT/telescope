import Head from 'next/head';
import { useRouter } from 'next/router';
import { telescopeUrl } from '../config';

type SEOProps = {
  pageTitle: string;
};

const SEO = ({ pageTitle }: SEOProps) => {
  const { pathname } = useRouter();
  const currentUrl = `${telescopeUrl}${pathname}`;
  // This variable explicitly points to our production API_URL.
  // For reference, see https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls#rel-canonical-header-method
  const canonicalUrl = `https://telescope.cdot.systems${pathname}`;

  return (
    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta name="twitter:title" content={pageTitle} />
      <title>{pageTitle}</title>
    </Head>
  );
};

export default SEO;
