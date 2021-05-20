// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'lokalkauf-security-testing',
    appId: '1:1056653798296:web:dec81d3506bd353c41d9ed',
    databaseURL: 'https://lokalkauf-security-testing.firebaseio.com',
    storageBucket: 'lokalkauf-security-testing.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyBb_aChDOeE6L2vYyzluSgtDlQY04vlB00',
    authDomain: 'lokalkauf-security-testing.firebaseapp.com',
    messagingSenderId: '1056653798296',
    measurementId: 'G-C5Q2KM9D7G',
  },
  algolia: {
    appId: 'V051EVLWXE',
    searchKey: '85739eacae698fba1aaf524e40fe1b99',
    indexName: 'incubator_TRADERS',
  },
  openrouteservice: {
    apikey: '5b3ce3597851110001cf624849bebcbe63f94701b7afdcdbe298da5f',
  },
  version: require('../../package.json').version,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
