module.exports = (url) => {
  try {
    const ghUrl = new URL(url);
    if (ghUrl.hostname !== 'github.com') {
      return null;
    }
    return ghUrl;
  } catch (err) {
    return null;
  }
};
