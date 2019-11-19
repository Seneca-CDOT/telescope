// Test for sanitize html

const sanitizeHTML = require('../src/sanitize-html');

test('Tests for sanitized HTML', () => {
  return sanitizeHTML('<img src=x onerror=alert(1)//>').then(data => {
    expect(data).toBe('<img src="x">');
  })
});