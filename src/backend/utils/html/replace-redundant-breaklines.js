const redundantBreaklineRegex = /(<br>((\s?)+)){2,}|((<p>|<div>)(\s+)?(<br>)(\s+)?(<\/p>|<\/div>)((\s?)+)){1,}/g;

module.exports = function (html) {
  return html.replace(redundantBreaklineRegex, '<br>\n').trim();
};
