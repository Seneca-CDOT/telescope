import Head from 'next/head';
import { useRouter } from 'next/router';
import { telescopeUrl } from '../config';

type SEOProps = {
  pageTitle: string;
};

const SEO = ({ pageTitle }: SEOProps) => {
  const { pathname } = useRouter();
  const currentUrl = `${telescopeUrl}${pathname}`;

  return (
    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={pageTitle} />
      <title>{pageTitle}</title>
    </Head>
  );
};

export default SEO;
