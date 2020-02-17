import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import Banner from '../Banner';
import SideDrawer from '../SideDrawer';
import Backdrop from '../Backdrop';
import TextArea from '../TextArea';

import logo from '../../images/logo.svg';

import './Layout.css';

const items = [
  { link: '#', text: 'Home' },
  { link: '#', text: 'Participants' },
  { link: '#', text: 'About' },
];

const isScrollBottom = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideDrawerOpen: false,
      scrolled: false,
      numPages: 1,
      posts: [],
    };
    this.drawerToggle = this.drawerToggle.bind(this);
    this.backdropClick = this.backdropClick.bind(this);
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

  drawerToggle() {
    this.setState(prevState => ({ sideDrawerOpen: !prevState.sideDrawerOpen }));
  }

  backdropClick() {
    this.setState({ sideDrawerOpen: false });
  }

  render() {
    return (
      <>
        <Banner className="banner" />
        <Header
          className="header"
          drawerHandler={this.drawerToggle}
          scrolled={this.state.scrolled}
        />
        <SideDrawer
          className="sidedrawer"
          show={this.state.sideDrawerOpen}
          items={items}
          logo={logo}
        />
        <Backdrop click={this.backdropClick} show={this.state.sideDrawerOpen} />
        <main className="main">
          <TextArea className="text-area" style={{ height: '100%' }} posts={this.state.posts} />
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
