import React from 'react';
import PropTypes from 'prop-types';

const ReadingTime = props => {
  const calc = () => {
    const wc = props.text.replace(/[^\w ]/g, '').split(/\s+/).length;

    const readingTimeInMinutes = Math.floor(wc / 228) + 1;
    return readingTimeInMinutes;
  };
  return (
    <div>
      <h5>{calc}</h5>
    </div>
  );
};
ReadingTime.propTypes = {
  text: PropTypes.string,
};
export default ReadingTime;
