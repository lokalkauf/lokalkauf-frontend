// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { COLLECTION_ENABLED } from '@angular/fire/analytics';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDWKZmGX7RaxDfv8_s_mqA_Ct9iFSP2GiM',
    // authDomain: 'lokalkauf-staging.firebaseapp.com',
    databaseURL: 'https://lokalkauf-staging.firebaseio.com',
    projectId: 'lokalkauf-staging',
    storageBucket: 'lokalkauf-staging.appspot.com',
    // messagingSenderId: '464711391631',
    appId: '1:464711391631:web:defbf4ea539d12b80d53fa',
    measurementId: 'G-4MZVPHHSKR'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
