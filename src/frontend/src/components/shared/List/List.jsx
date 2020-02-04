import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem/ListItem';

const List = ({ items, className }) => {
  return (
    <>
      <ul className={`${className}-items`}>
        {items.map(({ link, text }, index) => (
          <Fragment key={index}>
            <ListItem link={link} text={text} className={`${className}-item`} />
          </Fragment>
        ))}
      </ul>
    </>
  );
};

List.propTypes = {
  items: PropTypes.array,
  className: PropTypes.string,
};

export default List;
