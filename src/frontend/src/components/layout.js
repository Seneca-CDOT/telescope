import React, { Component } from 'react';

import Header from './Header';
import SideDrawer from './SideDrawer';
import Backdrop from './Backdrop';
import TextArea from './TextArea';
import Logo from './shared/Logo';

import logo from '../images/logo.svg';

import data from '../../../../dummyData.json';

import '../css/style.css';

const items = [
  { link: '#', text: 'Home' },
  { link: '#', text: 'Participants' },
  { link: '#', text: 'About' },
];

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideDrawerOpen: false,
      scrolled: false,
    };
    this.drawerToggle = this.drawerToggle.bind(this);
    this.backdropClick = this.backdropClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const isTop = window.scrollY > 320;
      if (isTop) this.setState({ scrolled: true });
      else this.setState({ scrolled: false });
    });
  }

  drawerToggle() {
    this.setState(prevState => ({ sideDrawerOpen: !prevState.sideDrawerOpen }));
  }

  backdropClick() {
    this.setState({ sideDrawerOpen: false });
    console.log('click');
  }

  render() {
    return (
      <>
        <Logo logo={logo} className="main" />
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
          <TextArea className="text-area" style="height: 100%" posts={data} />
        </main>
        <footer>© {new Date().getFullYear()}</footer>
      </>
    );
  }
}

export default Layout;
