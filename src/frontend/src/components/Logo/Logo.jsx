import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ className, logo }) => (
  <div className={`${className}__logo`}>
    <img src={logo} alt="" />
  </div>
);

Logo.propTypes = {
  className: PropTypes.string,
  logo: PropTypes.any,
};

export default Logo;
