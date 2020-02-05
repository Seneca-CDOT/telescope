import React from 'react';
import PropTypes from 'prop-types';

const ListItem = ({ link, text, className }) => {
  return (
    <li className={className}>
      <a href={link}>{text}</a>
    </li>
  );
};

ListItem.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default ListItem;
