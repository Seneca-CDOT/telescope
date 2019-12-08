require('../lib/config');
const nodemailer = require('nodemailer');
const { logger } = require('./logger');

const log = logger.child({ module: 'email-sender' });

/*
                             HOW TO USE
 Import this file - const sendEmail = require('./email-sender);
 send email - sendEmail.sendMessage('emailName@hotmail.com','Seneca had an error',
 '<p>An Error had occured</p>');

 Parameters examples
 receipiants - 'emailName@hotmail.com,emailName2@hotmail.com'
 subjectMessage - 'Seneca Telescope had an error'
 message - '<p>An Error has occurred <br/>Error Message:</p>'
*/

// Creates and returns a transporter using the passed in parameters
exports.createTransporter = function(hosted, portNum, isSecure, username, password) {
  const transporter = nodemailer.createTransport({
    // Email Server (.env variable must be used refer to the Contribution.md)
    host: hosted,
    port: portNum,
    secure: isSecure,
    auth: {
      // Email Name (.env variables must be used refer to the Contribution.md)
      user: username,
      // Email Pass (.env variables must be used refer to the Contribution.md)
      pass: password,
    },
  });

  return transporter;
};

// Create a mail option that can be sent by passing it to a transport using sendMail()
exports.createMail = function(receipients, subjectMessage, message) {
  // Email Content
  const mailOptions = {
    from: process.env.NODEMAILER_USERNAME, // Email Name
    to: receipients, // People to send to
    subject: subjectMessage, // Subject Line
    html:
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
      '</body>', // Message Body
  };

  return mailOptions;
};

// Verifies if the transporter passed was created successfully
exports.verifyTransporter = function(transporter) {
  // Verify connection configuration
  transporter.verify(err => {
    // If error then print to console
    if (err) {
      log.error({ err }, 'Transporter connection failed.');
      return false;
    }
    // else print a ready message
    log.info('Server is running properly');
    return true;
  });
};

// Sends a message using the passed in parameters
exports.sendMessage = async function(receipiants, subjectMessage, message) {
  return new Promise((resolve, reject) => {
    const transporter = this.createTransporter(
      process.env.NODEMAILER_SERVER,
      2222,
      false,
      process.env.NODEMAILER_USERNAME,
      process.env.NODEMAILER_PASSWORD
    );
    const allGood = this.verifyTransporter(transporter);
    if (!allGood) {
      reject(new Error()); // Send promise.reject if an error occurs
    }
    // Creates email for to be sent
    const mail = this.createMail(receipiants, subjectMessage, message);

    // Send the email with the email content
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        reject(err); // Send promise.reject if an error occurs
      } else {
        resolve(info.accepted); // Send promise.resolve if an error occurs
      }
    });
  });
};
