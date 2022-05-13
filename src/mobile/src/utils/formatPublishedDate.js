import moment from 'moment';

/**
 * Format a date string to MMMM DD, YYYY (e.g. May 13, 2022)
 * @param {string} dateString
 * @returns {string}
 */
const formatPublishedDate = (dateString) => {
  const date = new Date(dateString);
  return moment(date).format('MMMM DD, YYYY');
};

export default formatPublishedDate;
