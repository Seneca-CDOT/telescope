import Head from 'next/head';

import Banner from '../components/Banner';
import BackToTopButton from '../components/BackToTopButton';
import { useAuthenticatedUser } from '../components/UserProvider';
import MyFeeds from '../components/MyFeeds';

const MyFeedsPage = () => {
  const authenticated = useAuthenticatedUser(true);

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>My Feeds</title>
      </Head>

      <Banner />
      <BackToTopButton />
      <main className="main">
        <MyFeeds user={authenticated} />
      </main>
    </>
  );
};

export default MyFeedsPage;
