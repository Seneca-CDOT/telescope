module.exports = (htmlString, parser) => {
  const doc = parser.parseFromString(htmlString, 'text/html');

  const allGithubLinks = Array.from(
    // all links that have href that starts with 'https://github.com'
    doc.querySelectorAll("a[href^='https://github.com']"),
    (element) => element.href
  );

  return [...new Set(allGithubLinks)];
};
