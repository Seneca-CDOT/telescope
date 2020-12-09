import { FC } from 'react';
import Head from 'next/head';
import useSiteMetadata from '../hooks/use-site-metadata';

interface Props {
  description: string;
  lang: string;
  title: string;
}

const SEO: FC<Props> = ({ description, lang, title }) => {
  const siteMetadata = useSiteMetadata();
  const metaDescription = description || siteMetadata.description;
  return (
    <Head>
      <html lang={lang} />
      <title>{`${title} | ${siteMetadata.title}`}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
    </Head>
  );
};

export default SEO;
