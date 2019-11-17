const nodemailer = require('nodemailer');

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

exports.sendMessage = async function (receipiants, subjectMessage, message) {
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
        console.log(error);
      // else print a ready message
      } else if (success) {
        console.log('Server is running properly');
      }
    });

    // Email Content
    const mailOptions = {
      from: process.env.NODEMAILER_USERNAME, // Email Name
      to: receipiants, // People to send to
      subject: subjectMessage, // Subject Line
      html: message, // Message Body
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
