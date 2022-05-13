/**
 * Return the initial of a Name
 * @param {string} name
 * @returns {string}
 */
const getNameInitials = (name) => {
  return (
    name
      .replace(/[^a-zA-Z ]/g, '')
      .trim()
      .split(' ')
      // splitName represents the current value, i represents its index, and arr represent the whole splitted name-word array
      // if the index is 0, means it's the first word in the name
      // if the index+1 equals to the array length, it means the current value is the last word in the name
      // anything rather than first word or last word will not be included in initials
      .map((splitName, i, arr) =>
        i === 0 || i + 1 === arr.length ? splitName[0].toUpperCase() : null
      )
      .join('')
  );
};

export default getNameInitials;
