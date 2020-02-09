import React from 'react';
import PropTypes from 'prop-types';

import useSiteMetadata from '../../hooks/use-site-metadata';

import Login from '../Login';
import List from '../shared/List/List.jsx';
import HamburgerButton from '../HamburgerButton';

import './Header.css';

const items = [
  { link: '/', text: 'test' },
  { link: '/', text: 'test2' },
];

const Header = ({ className, drawerHandler, scrolled }) => {
  const { title } = useSiteMetadata();

  return (
    <header className={`${className} ${scrolled ? 'sticky' : ''}`}>
      <nav className={`${className}__navigation`}>
        <div>
          <HamburgerButton click={drawerHandler} />
        </div>
        <div className={`${className}__title`}>
          <a href="/">{title}</a>
          <Login />
        </div>
        <div className="spacer" />
        <List items={items} className={`${className}__navigation`} />
      </nav>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  drawerHandler: PropTypes.func,
  scrolled: PropTypes.bool,
};

export default Header;
