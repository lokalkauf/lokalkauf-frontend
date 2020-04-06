import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

admin.initializeApp();

const MAX_NUMBER_OF_IMAGES = 6;

/**
 * Here we're using Gmail to send
 */

const OAuth2 = google.auth.OAuth2;
const clientID = functions.config().mail.oauth.client_id;
const clientSecret = functions.config().mail.oauth.client_secret;

const oauth2Client = new OAuth2(
  clientID, //client Id
  clientSecret, // Client Secret
  'https://developers.google.com/oauthplayground' // Redirect URL
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'info@lokalkauf.org',
    clientId: clientID,
    clientSecret: clientSecret,
  },
});

export const sendMail = functions.https.onCall(async (data, context) => {
  console.log(data);

  const refreshToken = functions.config().mail.oauth.refresh_token;

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const tokens = await oauth2Client.refreshAccessToken();
  const accessToken = tokens.credentials.access_token;

  let htmlOutput = '';
  let cpSubject = '';
  if (data.mailType == 'feedback') {
    htmlOutput = `<div style="text-align:center;">
    <img src="https://lokalkauf-staging.web.app/assets/logo.png" style="width:300px;height:100px">
        <h2>Bestätigung deiner Anfrage</h2>
        <h4>Du hast eine Anfrage versendet:</h4>
        <p>${data.message}</p>
        <b>Folgende Kontaktinformationen wurden hinterlassen:</b>
        <p>${data.fromEmail}</p>
        <br>
        <b> Dein LokalKauf Team </b>
</div>`;
    cpSubject = 'Kopie Deines Feedbacks';
  } else if (data.mailType == 'trader-contact') {
    htmlOutput = `<div style="text-align:center;">
    <img src="https://lokalkauf-staging.web.app/assets/logo.png" style="width:300px;height:100px"/>
          <h2>Neue Kundenanfrage</h2>
          <h4>Du hast eine neue Anfrage</h4>
          <p>${data.message}</p>
          <b>Folgende Kontaktinformationen wurden hinterlassen:</b>
          <p>${data.fromEmail}</p>
          <br>
          <b> Dein LokalKauf Team </b>
          <br>
          <img src="https://lokalkauf-staging.web.app/assets/thankyou-image.png"/>
    </div>`;
    cpSubject = 'Kopie Deiner Nachricht an das Geschäft: ' + data.toName;
  }

  const mailOptions = {
    from: 'LokalKauf < info@lokalkauf.org >',
    to: data.toEmail,
    subject: data.title,
    html: htmlOutput,
    auth: {
      accessToken: accessToken,
    },
  };

  const cpMailOptions = {
    from: 'LokalKauf < info@lokalkauf.org >',
    to: data.fromEmail,
    subject: cpSubject,
    html:
      `<h2>Hi, dies ist die Kopie Deiner Nachricht.</h2>
           <hr>
           <div style="background: lightgrey">` +
      htmlOutput +
      `</div>`,
    auth: {
      accessToken: accessToken,
    },
  };

  let returnValue: object;
  // returning result
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      returnValue = error;
    } else {
      transporter.sendMail(cpMailOptions, (cpError, cpInfo) => {
        if (cpError) {
          returnValue = cpError;
        }
      });
    }
    if (returnValue) {
      return returnValue;
    }
    return 'Sended';
  });
  return;
});

export const sendCustomVerifyMail = functions.auth
  .user()
  .onCreate(async (user) => {
    const refreshToken = functions.config().mail.oauth.refresh_token;
    const url = functions.config().app.url;
    const apiKey = functions.config().app.apikey;

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    const tokens = await oauth2Client.refreshAccessToken();
    const accessToken = tokens.credentials.access_token;
    let link = '';
    let parameter;

    if (typeof user.email === 'undefined') {
      return;
    }
    link = await admin.auth().generateEmailVerificationLink(user.email);
    parameter = link.split('&');
    const finalLink =
      url +
      '/verify?mode=verifyEmail&' +
      parameter.slice(1, 2) +
      '&apiKey=' +
      apiKey +
      '&lang=de';

    const message =
      '<div style="text-align:center;">' +
      '<img src="https://lokalkauf-staging.web.app/assets/logo.png" style="width:300px;height:100px"/>' +
      '<h4>Lieber lokalkauf-Nutzer,</h4>' +
      '<p>Vielen Dank, dass du dich für lokalkauf entschieden hast!</p>' +
      '<p>Bitte klicke auf den folgenden Link, um die Registrierung abzuschließen: </p>' +
      '<a href="' +
      finalLink +
      '">hier klicken</a>' +
      '<p>Erst nach erfolgreicher Bestätigung, kannst du dein Profil bearbeiten.</p>' +
      '<p>Viel Grüße,</p>' +
      '<p>Dein lokalkauf-Team<p>';

    const mailOptions = {
      from: 'LokalKauf < info@lokalkauf.org >',
      to: user.email,
      subject: 'Bestätige deine E-Mail-Adresse für lokalkauf',
      html: message,
      auth: {
        accessToken: accessToken,
      },
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error, info);
      }
    });
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
              .catch(() => {
                console.log('File delete faild');
              });
          }
        })
        .catch(() => console.log('Check faild'));
    }
  });

exports.deleteThumbnailsTriggeredByImageDeletion = functions.storage
  .object()
  .onDelete(async (snapshot, context) => {
    //console.log('#######');
    //console.log('#######' + snapshot.name);

    if (
      snapshot.name &&
      snapshot.name.indexOf('/BusinessImages/') > -1 &&
      snapshot.name.indexOf('/BusinessImages/thumbs') < 0
    ) {
      const a = snapshot.name.indexOf('/BusinessImages/');

      console.log(`delete thumbnail of ${snapshot.name}`);

      let thumbnail: string;

      try {
        let name = snapshot.name.substring(a + '/BusinessImages/'.length);

        name =
          name.substring(0, name.lastIndexOf('.')) +
          '_200x200' +
          name.substring(name.lastIndexOf('.'));

        thumbnail =
          snapshot.name.substring(0, a) + '/BusinessImages/thumbs/' + name;

        admin
          .storage()
          .bucket()
          .deleteFiles({ prefix: thumbnail }, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log(`${thumbnail} successfull deleted`);
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
  });

export const deleteUser = functions.auth.user().onDelete(async (user) => {
  admin
    .storage()
    .bucket()
    .deleteFiles({ prefix: `Traders/${user.uid}` }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(
          `All the Firebase Storage files in users/${user.uid}/ have been deleted`
        );
      }
    });
  await admin.firestore().doc(`Traders/${user.uid}`).delete();
  console.log(`Deleted Firestore document Traders/${user.uid}`);
  await admin.firestore().doc(`locations/${user.uid}`).delete();
  console.log(`Deleted Firestore document locations/${user.uid}`);
});
