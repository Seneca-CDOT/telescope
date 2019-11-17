const emailsender = require('../src/email-sender');

// This tests sendMessage from /src/email-sender.js:
// It gives a test email and recipient to the sendMessage function
// and checks if it's resolve returns what is to be expected,
// which an array of the testRecipient since it returns
// an array of addresses it sent the email too
test.skip('Tests if sendMessage resolves with expected info', async () => {
  // Feeds test data into sendMessage function
  const testSubjectMessage = 'Test';
  const testHTML = '<h1>Hello World</h1>';
  const testRecipient = process.env.NODEMAILER_TESTRECIPIENT;
  const testReturnValue = await emailsender.sendMessage(
    testRecipient,
    testSubjectMessage,
    testHTML,
  );
  // Tests if the expected resolve is correct
  expect(testReturnValue).resolves.toBe([testRecipient]);
});
