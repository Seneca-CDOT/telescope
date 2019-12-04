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

exports.sendMessage = async function(receipiants, subjectMessage, message) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      // Email Server (.env variable must be used refer to the Contribution.md)
      host: process.env.NODEMAILER_SERVER,
      port: 25,
      secure: false,
      auth: {
        // Email Name (.env variables must be used refer to the Contribution.md)
        user: process.env.NODEMAILER_USERNAME,
        // Email Pass (.env variables must be used refer to the Contribution.md)
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // verify connection configuration
    transporter.verify((error, success) => {
      // If error then print to console
      if (error) {
        log.error(error);
        // else print a ready message
      } else if (success) {
        log.info('Server is running properly');
      }
    });

    // Email Content
    const mailOptions = {
      from: process.env.NODEMAILER_USERNAME, // Email Name
      to: receipiants, // People to send to
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

    // Send the email with the email content
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err); // Send promise.reject if an error occurs
      } else {
        resolve(info.accepted); // Send promise.resolve if an error occurs
      }
    });
  });
};
