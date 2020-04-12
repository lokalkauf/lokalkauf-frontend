import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import * as nodemailer from 'nodemailer';
//import { google } from 'googleapis';
import * as sgMail from '@sendgrid/mail';

admin.initializeApp();

const MAX_NUMBER_OF_IMAGES = 6;

export const sendGrid = functions.https.onCall(async (data, context) => {
  sgMail.setApiKey(functions.config().mail.sendgrid.api_key);

  sgMail
    .send({
      from: 'lokalkauf < info@lokalkauf.org >',
      to: data.toEmail,
      subject: data.title,
      templateId: data.templateId,
      dynamicTemplateData: data.teplateVars,
    })
    .then(
      (result) => {
        console.log('Sent email');
      },
      (err) => {
        console.error(err);
      }
    );

  sgMail
    .send({
      from: 'lokalkauf < info@lokalkauf.org >',
      to: data.fromEmail,
      subject: data.title,
      templateId: data.templateIdCopy,
      dynamicTemplateData: data.teplateVars,
    })
    .then(
      (result) => {
        console.log('Sent email');
      },
      (err) => {
        console.error(err);
      }
    );
});

export const sendCustomVerifyMail = functions.auth
  .user()
  .onCreate(async (user) => {
    const url = functions.config().app.url;
    const apiKey = functions.config().app.apikey;

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

    sgMail.setApiKey(functions.config().mail.sendgrid.api_key);

    sgMail
      .send({
        from: 'lokalkauf < info@lokalkauf.org >',
        to: user.email,
        subject: 'Bestätige deine E-Mail-Adresse für lokalkauf',
        templateId: 'd-e8b544e2d76242fdac65fafdae382e37',
        dynamicTemplateData: {
          verification_url: finalLink,
        },
      })
      .then(
        (result) => {
          console.log('Sent email');
        },
        (err) => {
          console.error(err);
        }
      );
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
  .onDelete(async (snapshot, _context) => {
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

export const backupFirestoreDatabaseToStorage = functions.pubsub
  .schedule('every day 00:00')
  .onRun(async (_context) => {
    const projectId = admin.app().options.projectId;
    const backupBucket = functions.config().app.backupbucket;
    const client = new admin.firestore.v1.FirestoreAdminClient();
    const databaseName = client.databasePath(projectId, '(default)');
    console.log(databaseName);
    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: backupBucket,
        collectionIds: [],
      })
      .then((responses: any) => {
        const response = responses[0];
        console.log(`Operation Name: ${response['name']}`);
        return true;
      })
      .catch((err: any) => {
        console.error(err);
        throw new Error('Export operation failed');
      });
  });
