import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
admin.initializeApp();

/**
 * Here we're using Gmail to send
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().sendmail.user,
    pass: functions.config().sendmail.password,
  },
});

export const sendMail = functions.https.onCall((data, context) => {
  console.log(data);
  const output = `<img src="https://lokalkauf-staging.web.app/assets/lokalkaufTopx2.png" />
  <h3>Neue Kundenanfrage</h3>
  <h4>Du hast eine neue Anfrage</h4>
  <p>${data.message}</p>
  <h4>Folgende Kontaktinformationen wurden hinterlassen:</h4>
  <p>${data.fromEmail}</p>`;

  const mailOptions = {
    from: 'LokalKauf <musterfrauhans1234@gmail.com>',
    to: data.toEmail,
    subject: 'Anfrage von LokalKauf',
    html: output,
  };

  // returning result
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error.toString();
    }
    return 'Sended';
  });
  return;
});
