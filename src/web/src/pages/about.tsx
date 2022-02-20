import AboutFooter from '../components/AboutFooter';
import AboutPage from '../components/AboutPage';
import SEO from '../components/SEO';
import NavBar from '../components/NavBar';

const About = () => {
  return (
    <>
      <SEO pageTitle="About | Telescope" />
      <NavBar />
      <AboutPage />
      <AboutFooter />
    </>
  );
};

export default About;
