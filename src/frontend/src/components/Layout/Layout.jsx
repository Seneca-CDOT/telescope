import React, { useEffect } from 'react';
import Header from '../Header';
import Banner from '../Banner';
import Posts from '../Posts';
import ScrollToTop from '../ScrollToTop';
import SEO from '../SEO';
import useSiteMetaData from '../../hooks/use-site-metadata';

const isScrollBottom = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

function Layout() {
  const [scrolled, setScrolled] = React.useState(false);
  const [numPages, setNumPages] = React.useState(1);
  const [posts, setPosts] = React.useState([]);
  const { telescopeUrl } = useSiteMetaData();
  useEffect(() => {
    async function getPosts(pageNum = 1) {
      let postsData = [];
      try {
        // should be using telescopeUrl here
        const res = await fetch(`https://dev.telescope.cdot.systems/posts?page=${pageNum}`);
        const postsUrls = await res.json();
        postsData = await Promise.all(
          postsUrls.map(async ({ url }) => {
            // should be using telescopeUrl here
            const tmp = await fetch(`https://dev.telescope.cdot.systems${url}`);
            const post = await tmp.json();
            return post;
          })
        );
      } catch (err) {
        console.log({ err });
      }

      setPosts(...posts, postsData);
      setNumPages(numPages + 1);
    }

    getPosts(numPages);
    window.addEventListener('scroll', () => {
      const isTop = window.scrollY > 320;
      if (isTop) setScrolled(true);
      else setScrolled(false);

      if (isScrollBottom()) {
        setNumPages(numPages + 1);
        getPosts(numPages);
      }
    });
  }, []);

  return (
    <>
      <SEO title="Home" />
      <Header className="header" />
      <Banner className="banner" />
      <ScrollToTop />
      <main className="main">
        <Posts posts={posts} />
      </main>
      <footer>© {new Date().getFullYear()}</footer>
    </>
  );
}

export default Layout;
