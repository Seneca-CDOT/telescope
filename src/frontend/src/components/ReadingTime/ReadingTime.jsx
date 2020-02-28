import React from 'react';
import PropTypes from 'prop-types';

const calc = text => {
  const wc = text.replace(/[^\w ]/g, '').split(/\s+/).length;
  const readingTimeInMinutes = Math.floor(wc / 228) + 1;
  return readingTimeInMinutes;
};

const ReadingTime = props => {
  return (
    <div>
      <h5>Reading Time: {calc(props.text)} minutes</h5>
    </div>
  );
};
ReadingTime.propTypes = {
  text: PropTypes.string,
};
export default ReadingTime;
