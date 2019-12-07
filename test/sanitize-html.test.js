const sanitizeHTML = require('../src/backend/utils/sanitize-html');

describe('Sanitize HTML', () => {
  test('<img> should work, but inline js should not', () => {
    const data = sanitizeHTML('<img src="x" onerror="alert(1)" onload="alert(1)" />');
    expect(data).toBe('<img src="x" />');
  });
});
