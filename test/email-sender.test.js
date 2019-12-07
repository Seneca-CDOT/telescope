const emailsender = require('../src/backend/utils/email-sender');

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
  const testReturnValue = emailsender.sendMessage(testRecipient, testSubjectMessage, testHTML);
  // Tests if the expected resolve is correct
  expect(testReturnValue).resolves.toBe([testRecipient]);
});

// Tests with bad/non-existent recipient
test('Tests if sendMessage resolves with expected info', async () => {
  // Feeds test data into sendMessage function
  const testSubjectMessage = 'Test';
  const testHTML = '<h1>Hello World</h1>';
  const testRecipient = 'bademailwasddafadsc@bademail.com';

  // Tests if the expected resolve is correct
  await expect(
    emailsender.sendMessage(testRecipient, testSubjectMessage, testHTML)
  ).rejects.toThrow();
}, 10000);

// TODO: createTransporter() not creating transports properly. Unskip once done.
test.skip('Tests if verifyTransport returns with expected info', () => {
  const transporter = emailsender.createTransporter(
    'smtp.googlemail.com',
    2222,
    false,
    'dummytest878@gmail.com',
    'dumb1234'
  );
  const verifiedTransport = emailsender.verifyTransporter(transporter);
  expect(verifiedTransport).toBe(true);
});

test.skip('Tests if transport is created correctly', () => {
  const transporter = emailsender.createTransporter();

  expect(transporter.options).toHaveProperty('host', process.env.NODEMAILER_SERVER);
  expect(transporter.options).toHaveProperty('port', 2222);
  expect(transporter.options).toHaveProperty('secure', false);
  expect(transporter.options).toHaveProperty('auth.user', process.env.NODEMAILER_USERNAME);
  expect(transporter.options).toHaveProperty('auth.pass', process.env.NODEMAILER_PASSWORD);
}, 10000);

test('Tests if email object is created correctly', () => {
  const recipient = 'dummy@email.com';
  const subjectMessage = 'Hello';
  const message = 'FIX ME!';
  const email = emailsender.createMail(recipient, subjectMessage, message);

  expect(email).toHaveProperty('from', process.env.NODEMAILER_USERNAME);
  expect(email).toHaveProperty('to', 'dummy@email.com');
  expect(email).toHaveProperty('subject', 'Hello');
  expect(email).toHaveProperty(
    'html',
    '<body>' +
      '<table border="1" cellpadding="0" cellspacing="0" width="100%">' +
      '<td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0;">' +
      '<h1 style="font-size:40px"><b>Seneca-CDOT Telescope</b></h1>' +
      '<a href="https://github.com/Seneca-CDOT/telescope" style="font-size:30px">Github</a>' +
      '</td>' +
      '<td align="center" bgcolor="#db3d3d" style="padding: 40px 0 30px 0;">' +
      '<h1 style="font-size:40px"><b>⚠️ERROR</b></h1>' +
      '</td>' +
      '<tr><td style="padding: 40px 30px 40px 30px;" colspan="2">' +
      '<table cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">' +
      '<tr><td width="15%"><b>Error Message:</b></td>' +
      `<td style="word-wrap:break-word" width="85%">${message}</td></tr>` +
      '</table></td>' +
      '</table>' +
      '</body>'
  );
});
