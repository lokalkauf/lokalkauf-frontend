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
    user: '****@gmail.com',
    pass: '******',
  },
});
export const sendMail = functions.https.onCall((target, text) => {
  const mailOptions = {
    from: 'LokalKauf',
    to: target,
    subject: 'Anfrage von LokalKauf',
    html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p><br />
                    <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
                `, // email content in HTML
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
