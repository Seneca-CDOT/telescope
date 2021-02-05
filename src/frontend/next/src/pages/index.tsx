import Head from 'next/head';
import { Theme } from '@material-ui/core';
import Banner from '../components/Banner';
import BackToTopButton from '../components/BackToTopButton';
import Posts from '../components/Posts';
import styles from '../styles/Home.module.css';
import Header from '../components/Header/header';
import ThemeToggleButton from '../components/ThemeToggleButton';

type Props = {
  theme: Theme;
  toggleTheme: () => void;
};
const Home = ({ theme, toggleTheme }: Props) => {
  return (
    <>
      <Head>
        <title>Telescope</title>
        <meta property="og:title" content="Telescope" key="title" />
      </Head>
      <Header />

      <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      <Banner />
      <BackToTopButton />
      <main className="main">
        <Posts />
      </main>
    </>
  );
};

export default Home;
