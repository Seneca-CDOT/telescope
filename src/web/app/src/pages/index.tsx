import { useState } from 'react';
import { StyledEngineProvider } from '@mui/material';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import NavBar from '../components/NavBar';
import SEO from '../components/SEO';

const Home = () => {
  const [bannerVisible, setBannerVisibility] = useState(true);
  return (
    <>
      <StyledEngineProvider injectFirst>
        <SEO pageTitle="Telescope" />
        <Banner
          onVisibilityChange={(visible) => setBannerVisibility(visible)}
          bannerVisible={bannerVisible}
        />
        <main className="main">
          <NavBar disabled={bannerVisible} />
          <Posts />
        </main>
      </StyledEngineProvider>
    </>
  );
};

export default Home;
