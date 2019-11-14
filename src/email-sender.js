const nodemailer = require('nodemailer');

/*
                             HOW TO USE                                
 Import this file - const sendEmail = require('./email-sender);
 send email - sendEmail.sendMessage('emailName@hotmail.com','Seneca had an error', '<p>An Error had occured</p>');

 Parameters examples
 receipiants - 'emailName@hotmail.com,emailName2@hotmail.com'
 subjectMessage - 'Seneca Telescope had an error'
 message - '<p>An Error has occurred <br/>Error Message:</p>'
*/

exports.sendMessage = async function (receipiants, subjectMessage, message) {
  return new Promise((resolve, reject) => {

    // Credientials to send an email from
    const transporter = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVER, // Email Server (.env variable must be used refer to the Contribution.md)
      auth: {
        user: process.env.NODEMAILER_USERNAME, // Email Name (.env variables must be used refer to the Contribution.md)
        pass: process.env.NODEMAILER_PASSWORD, // Email Pass (.env variables must be used refer to the Contribution.md)
      },
    });

    // Email Content
    const mailOptions = {
      from: '', // Email Name
      to: receipiants, // People to send to
      subject: subjectMessage, // Subject Line
      html: message, // Message Body
    };

    // Send the email with the email content
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
