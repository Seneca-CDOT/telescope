const nodemailer = require('nodemailer');

/*
*                             HOW TO USE                                 *
* Import this file - const sendEmail = require('./email-sender);         *
* send email - sendEmail.sendMessage("Put your error message in here");  *
*/

exports.sendMessage = async function (errorMessage) {
  // Recipients list of users to send the email too
  // receipiants is commas separated (emailName@hotmail.com,emailName2@hotmail.com)
  const receipiants = '';

  // Credientials to send an email from
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '', // Email Name (.env variables must be used refer to issue#60)
      pass: '', // Email Pass (.env variables must be used refer to issue#60)
    },
  });

  // Email Content
  const mailOptions = {
    from: '', // Email Name
    to: receipiants,
    subject: 'Seneca Telescope had an error', // Subject Line
    html: `<p>An Error has occurred <br/>Error Message: ${errorMessage} </p>`, // Message Body
  };

  // Send the email with the email content
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
