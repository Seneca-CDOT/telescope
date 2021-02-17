import Head from 'next/head';
import Banner from '../components/Banner';
import BackToTopButton from '../components/BackToTopButton';
import Posts from '../components/Posts';

const Home = () => {
  return (
    <>
      <Head>
        <title>Telescope</title>
        <meta property="og:title" content="Telescope" key="title" />
      </Head>
      <Banner />
      <BackToTopButton />
      <main className="main">
        <Posts />
      </main>
    </>
  );
};

export default Home;
