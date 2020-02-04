import React from 'react';
import PropTypes from 'prop-types';
import List from '../shared/List/List.jsx';
import Logo from '../Logo/Logo.jsx';

import './sideDrawer.css';

const SideDrawer = ({ className, items, show, logo }) => (
  <nav className={`${className} ${show ? 'open' : ''}`}>
    <Logo className={className} logo={logo} />
    <List items={items} className={`${className}__navigation`} />
  </nav>
);

SideDrawer.propTypes = {
  items: PropTypes.array,
  className: PropTypes.string,
  show: PropTypes.bool,
  logo: PropTypes.any,
};

export default SideDrawer;
