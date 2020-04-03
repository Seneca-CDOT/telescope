import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Banner from '../Banner';
import Posts from '../Posts';
import ScrollToTop from '../ScrollToTop';
import SEO from '../SEO';
import useSiteMetaData from '../../hooks/use-site-metadata';

function Layout() {
  const [numPages, setNumPages] = useState(1);
  const [posts, setPosts] = useState([]);
  const { telescopeUrl } = useSiteMetaData();

  useEffect(() => {
    async function getPosts(pageNum = 1) {
      let postsData = [];
      try {
        const res = await fetch(`https://dev.telescope.cdot.systems/posts?page=${pageNum}`);
        // const res = await fetch(`${telescopeUrl}/posts?page=${pageNum}`);
        const postsUrls = await res.json();
        postsData = await Promise.all(
          postsUrls.map(async ({ url }) => {
            const tmp = await fetch(`https://dev.telescope.cdot.systems${url}`);
            // const tmp = await fetch(`{telescopeUrl}${url}`);
            const post = await tmp.json();
            return post;
          })
        );
        setPosts([...posts, ...postsData]);
        setNumPages(numPages + 1);
      } catch (err) {
        console.log({ err });
      }
    }

    getPosts(numPages);
  }, [telescopeUrl]);

  return (
    <>
      <SEO title="Home" />
      <Header className="header" />
      <Banner className="banner" />
      <ScrollToTop />
      <main className="main">{posts.length > 0 ? <Posts posts={posts} /> : null}</main>
      <footer>© {new Date().getFullYear()}</footer>
    </>
  );
}

export default Layout;
