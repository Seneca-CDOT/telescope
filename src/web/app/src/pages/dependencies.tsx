import SEO from '../components/SEO';
import NavBar from '../components/NavBar';
import DependenciesPage from '../components/DependenciesPage';

const dependencies = () => {
  return (
    <div>
      <SEO pageTitle="Dependencies | Telescope" />
      <NavBar />
      <DependenciesPage />
    </div>
  );
};

export default dependencies;
