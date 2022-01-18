// parsesUrl to make sure there is only a single port
const parseUrl = (url, port) => {
  try {
    const urlObj = new URL(url);
    urlObj.port = port;
    return urlObj.href;
  } catch (e) {
    return null;
  }
};

module.exports = parseUrl;
