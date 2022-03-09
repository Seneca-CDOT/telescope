import { useState } from 'react';
import SEO from '../components/SEO';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import NavBar from '../components/NavBar';

const Home = () => {
  const [bannerVisible, setBannerVisibility] = useState(true);
  return (
    <>
      <SEO pageTitle="Telescope" />
      <Banner
        onVisibilityChange={(visible) => setBannerVisibility(visible)}
        bannerVisible={bannerVisible}
      />
      <main className="main">
        <NavBar disabled={bannerVisible} />
        <Posts />
      </main>
    </>
  );
};

export default Home;
