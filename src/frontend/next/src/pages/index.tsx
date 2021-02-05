import Head from 'next/head';
import Banner from '../components/Banner';
import BackToTopButton from '../components/BackToTopButton';
import Posts from '../components/Posts';
import styles from '../styles/Home.module.css';
import Header from '../components/Header/header';

const Home = () => {
  return (
    <>
      <Head>
        <title>Telescope</title>
        <meta property="og:title" content="Telescope" key="title" />
      </Head>
      <Header />

      <Banner />
      <BackToTopButton />
      <main className="main">
        <Posts />
      </main>
    </>
  );
};

export default Home;
