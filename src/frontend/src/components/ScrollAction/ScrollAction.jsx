import React from 'react';
import PropTypes from 'prop-types';

const ScrollAction = ({ children }) => {
  const handleClick = (event) => {
    const mobile = window.innerWidth <= 1020;
    const anchor = mobile
      ? (event.target.ownerDocument || document).querySelector('#back-to-top-anchor-mobile')
      : (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div onClick={handleClick} role="presentation">
      {children}
    </div>
  );
};

ScrollAction.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ScrollAction;
