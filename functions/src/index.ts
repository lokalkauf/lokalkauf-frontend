import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
admin.initializeApp();

const MAX_NUMBER_OF_IMAGES = 5;

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
    to: [data.toEmail, data.fromEmail],
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

export const checkFileNumberLimit = functions.storage
  .object()
  .onFinalize(async (object) => {
    if (object.name !== undefined) {
      const filePath = object.name;
      const bucket = admin.storage().bucket();
      const directory = filePath.split('/').slice(0, 2).join('/');

      bucket
        .getFiles({ directory: directory })
        .then(function (files) {
          if (files[0].length > MAX_NUMBER_OF_IMAGES) {
            console.log('Reachd max file num. Delete File...');
            bucket
              .file(filePath)
              .delete()
              .catch(
                () =>
                  function () {
                    console.log('File delete faild');
                  }
              );
          }
        })
        .catch(() => console.log('Check faild'));
    }
  });
