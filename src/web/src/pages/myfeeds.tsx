import SEO from '../components/SEO';
import useAuth from '../hooks/use-auth';
import MyFeeds from '../components/MyFeeds';

const MyFeedsPage = () => {
  const { login, user } = useAuth();

  // Redirect the user to login if they aren't authenticated already
  if (!user) {
    return login('/myfeeds');
  }

  return (
    <>
      <SEO pageTitle="My Feeds | Telescope" />
      <main className="main">
        <MyFeeds user={user} />
      </main>
    </>
  );
};

export default MyFeedsPage;
