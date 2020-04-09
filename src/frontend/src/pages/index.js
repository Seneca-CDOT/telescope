import React, { useEffect, useState, useRef } from 'react';
import PageBase from './PageBase';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import ScrollToTop from '../components/ScrollToTop';
import useSiteMetaData from '../hooks/use-site-metadata';
import CustomizedSnackBar from '../components/SnackBar';

export default function IndexPage() {
  const [numPages, setNumPages] = useState(1);
  const [posts, setPosts] = useState([]);
  const [initNumPosts, setInitNumPosts] = useState(0);
  const [currentNumPosts, setCurrentNumPosts] = useState(0);
  const { telescopeUrl } = useSiteMetaData();
  const savedCallback = useRef();

  useEffect(() => {
    async function getPosts(pageNum = 1) {
      try {
        const res = await fetch(`${telescopeUrl}/posts?page=${pageNum}`);
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const postsUrls = await res.json();
        const postsData = await Promise.all(
          postsUrls.map(async ({ url }) => {
            const tmp = await fetch(`${telescopeUrl}${url}`);
            if (!tmp.ok) {
              throw new Error(tmp.statusText);
            }
            const post = await tmp.json();
            return post;
          })
        );
        setPosts([...posts, ...postsData]);
        setNumPages(numPages + 1);
      } catch (error) {
        console.log('Something went wrong when fetching data', error);
      }
    }

    getPosts(numPages);
  }, [telescopeUrl]);

  async function getPostsCount() {
    try {
      const res = await fetch(`${telescopeUrl}/posts`, { method: 'HEAD' });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.headers.get('x-total-count');
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  function callback() {
    getPostsCount()
      .then(setCurrentNumPosts)
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    savedCallback.current = callback;
  });

  // Get the current + initial posts count when page loads
  useEffect(() => {
    async function setPostsInfo() {
      try {
        await Promise.all([
          setInitNumPosts(await getPostsCount()),
          setCurrentNumPosts(await getPostsCount()),
        ]);
      } catch (error) {
        console.log({ error });
      }
    }
    setPostsInfo();
  }, []);

  useEffect(() => {
    function getCurrentNumPosts() {
      savedCallback.current();
    }

    savedCallback.current = callback;
    // Polls every 5 minutes
    const interval = setInterval(getCurrentNumPosts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentNumPosts]);

  return (
    <PageBase title="Home">
      <Banner />
      <ScrollToTop />
      <main>
        {posts.length > 0 ? <Posts posts={posts} /> : null}
        {currentNumPosts !== initNumPosts ? <CustomizedSnackBar posts={currentNumPosts} /> : null}
      </main>
      <footer>© {new Date().getFullYear()}</footer>
    </PageBase>
  );
}
