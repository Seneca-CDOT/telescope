import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Posts from '../components/Posts';

const Home = () => {
  return (
    <>
      <SEO pageTitle="Telescope" />
      <Banner />
      <main className="main">
        <Posts />
      </main>
    </>
  );
};

export default Home;
