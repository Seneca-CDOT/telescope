import React from 'react';
import PropTypes from 'prop-types';

const Backdrop = props => (
  <div className={`backdrop ${!props.show ? 'open' : ''}`} onClick={props.click}></div>
);

Backdrop.propTypes = {
  show: PropTypes.bool,
  click: PropTypes.func,
};

export default Backdrop;
