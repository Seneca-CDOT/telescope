import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import Banner from '../Banner';
import Posts from '../Posts';
import ScrollToTop from '../ScrollToTop';
import SEO from '../SEO';

import './Layout.css';

const isScrollBottom = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
      numPages: 1,
      posts: [],
    };
  }

  componentDidMount() {
    const { telescopeUrl } = this.props;
    const { numPages } = this.state;

    this.getPosts(numPages, telescopeUrl);
    window.addEventListener('scroll', () => {
      const isTop = window.scrollY > 320;
      if (isTop) this.setState({ scrolled: true });
      else this.setState({ scrolled: false });

      if (isScrollBottom()) {
        this.setState(prevState => ({ numPages: prevState.numPages + 1 }));
        this.getPosts(numPages);
      }
    });
  }

  async getPosts(pageNum = 1, telescopeUrl) {
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
    } catch (err) {
      console.log({ err });
    }

    this.setState(prevState => ({
      posts: [...prevState.posts, ...postsData],
      numPages: prevState.numPages + 1,
    }));
  }

  render() {
    return (
      <>
        <SEO title="Home" />
        <Header className="header" />
        <Banner className="banner" />
        <ScrollToTop />
        <main className="main">
          <Posts posts={this.state.posts} />
        </main>
        <footer>© {new Date().getFullYear()}</footer>
      </>
    );
  }
}

Layout.propTypes = {
  telescopeUrl: PropTypes.string.isRequired,
};

export default Layout;
