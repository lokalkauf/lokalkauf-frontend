export const environment = {
  production: true,
  firebase: {
    projectId: 'lokalkauf-staging',
    appId: '1:464711391631:web:defbf4ea539d12b80d53fa',
    databaseURL: 'https://lokalkauf-staging.firebaseio.com',
    storageBucket: 'lokalkauf-staging.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyDWKZmGX7RaxDfv8_s_mqA_Ct9iFSP2GiM',
    authDomain: 'lokalkauf-staging.firebaseapp.com',
    messagingSenderId: '464711391631',
    measurementId: 'G-4MZVPHHSKR',
  },
  algolia: {
    appId: 'V051EVLWXE',
    searchKey: '85739eacae698fba1aaf524e40fe1b99',
    indexName: 'staging_TRADERS',
  },
  openrouteservice: {
    apikey: '5b3ce3597851110001cf624849bebcbe63f94701b7afdcdbe298da5f',
  },
  version: require('../../package.json').version,
};
