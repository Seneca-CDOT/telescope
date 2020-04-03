import React, { useEffect, useState } from 'react';
import PageBase from './PageBase';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';
import useSiteMetaData from '../hooks/use-site-metadata';

export default function IndexPage() {
  const [numPages, setNumPages] = useState(1);
  const [posts, setPosts] = useState([]);
  const { telescopeUrl } = useSiteMetaData();

  useEffect(() => {
    async function getPosts(pageNum = 1) {
      let postsData = [];
      try {
        const res = await fetch(`${telescopeUrl}/posts?page=${pageNum}`);
        const postsUrls = await res.json();
        postsData = await Promise.all(
          postsUrls.map(async ({ url }) => {
            const tmp = await fetch(`${telescopeUrl}${url}`);
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
    <PageBase>
      <>
        <SEO title="Home" />
        <Header className="header" />
        <Banner className="banner" />
        <ScrollToTop />
        <main className="main">{posts.length > 0 ? <Posts posts={posts} /> : null}</main>
        <footer>© {new Date().getFullYear()}</footer>
      </>
    </PageBase>
  );
}
