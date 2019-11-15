const emailsender = require('../src/email-sender');

test('Tests if sendMessage resolves with expected info', async () => {
  const testSubjectMessage = 'Test';
  const testHTML = '<h1>Hello World</h1>';
  const testRecipient = process.env.NODEMAILER_TESTRECIPIENT;
  const testReturnValue = await emailsender.sendMessage(
    testRecipient,
    testSubjectMessage,
    testHTML,
  );
  expect(testReturnValue).resolves.toBe([testRecipient]);
});
