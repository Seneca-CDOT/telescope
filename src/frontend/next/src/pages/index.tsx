import Head from 'next/head';
import { Theme } from '@material-ui/core';
import Banner from '../components/Banner';
import BackToTopButton from '../components/BackToTopButton';
import Posts from '../components/Posts';
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
