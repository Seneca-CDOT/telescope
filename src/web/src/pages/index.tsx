import { useState } from 'react';
import type { GetStaticPropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import NavBar from '../components/NavBar';

const Home = () => {
  const [bannerIsVisible, setBannerVisibility] = useState(true);
  return (
    <>
      <SEO pageTitle="Telescope" />
      <Banner onVisibilityChange={(visible) => setBannerVisibility(visible)} />
      <main className="main">
        <NavBar disabled={bannerIsVisible} />
        <Posts />
      </main>
    </>
  );
};
export async function getStaticProps({ locale }: GetStaticPropsContext & { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [`common`])),
    },
  };
}

export default Home;
