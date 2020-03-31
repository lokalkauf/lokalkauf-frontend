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

  const output = data.message;

  const mailOptions = {
    from: 'LokalKauf < info@lokalkauf.org >',
    to: data.toEmail,
    subject: data.title,
    html: output,
    auth: {
      accessToken: accessToken,
    },
  };

  const cpMailOptions = {
    from: 'LokalKauf < info@lokalkauf.org >',
    to: data.fromEmail,
    subject: 'Kopie Deiner Nachricht: ' + data.title,
    html: output,
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
