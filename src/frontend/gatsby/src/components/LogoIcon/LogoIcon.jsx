import React from 'react';
import PropTypes from 'prop-types';
import logoUrl from '../../images/logo.svg';

function LogoIcon({ height, width }) {
  return <img src={logoUrl} alt="logo" height={height} width={width} />;
}

LogoIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default LogoIcon;
