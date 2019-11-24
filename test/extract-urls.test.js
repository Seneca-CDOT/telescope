const getUrls = require('../src/backend/utils/extract-urls');

test('The Array contains the URL from the blog feed data', () => {
  const htmlData =
    'Feel free to view all the changes <a href="https://github.com/FreezingMoon/AncientBeast/pull/1555">here</a>!</div>';
  const urlArray = getUrls.extract(htmlData);
  expect(urlArray[0]).toBe('https://github.com/FreezingMoon/AncientBeast/pull/1555');
});

test('The result returned from extract() is an Array', () => {
  const htmlData =
    'Feel free to view all the changes <a href="https://github.com/FreezingMoon/AncientBeast/pull/1555">here</a>!</div>';
  const urlArray = getUrls.extract(htmlData);
  const res = Array.isArray(urlArray);
  expect(res).toBe(true);
});

test('The length of the array matches the number of URLs in the string', () => {
  const htmlData =
    'Feel free to view all the changes <a href="https://github.com/FreezingMoon/AncientBeast/pull/1555">here</a>!</div>';
  const urlArray = getUrls.extract(htmlData);
  expect(urlArray.length).toBe(1);
  expect(urlArray[0]).toBe('https://github.com/FreezingMoon/AncientBeast/pull/1555');
});

test('The url array remains empty after given no URL from the blog feed data', () => {
  const htmlData =
    'Feel free to view all the changes <a href="Lorem ipsum dolor sit amet consectetur adipiscing elit">here</a>!</div>';
  const urlArray = getUrls.extract(htmlData);
  expect(urlArray[0]).toBe(undefined);
  expect(urlArray.length).toBe(0);
});

test('The result is still an array after given no URLs from the blog feed data', () => {
  const htmlData =
    'Feel free to view all the changes <a href="Lorem ipsum dolor sit amet consectetur adipiscing elit">here</a>!</div>';
  const urlArray = getUrls.extract(htmlData);
  const res = Array.isArray(urlArray);
  expect(res).toBe(true);
});

test('The length of the array is 0 given no URL in the html data', () => {
  const htmlData =
    'Feel free to view all the changes  <a href="Lorem ipsum dolor sit amet consectetur adipiscing elit">here</a>!</div>';
  const urlArray = getUrls.extract(htmlData);
  expect(urlArray.length).toBe(0);
});
