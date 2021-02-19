import SEO from '../components/SEO';
import Banner from '../components/Banner';
import BackToTopButton from '../components/BackToTopButton';
import Posts from '../components/Posts';

const Home = () => {
  return (
    <>
      <SEO pageTitle="Telescope" />
      <Banner />
      <BackToTopButton />
      <main className="main">
        <Posts />
      </main>
    </>
  );
};

export default Home;
