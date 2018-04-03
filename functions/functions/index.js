'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Keeps track of the length of the 'followed' child list in a separate property.
exports.countfollowedchange = functions.database.ref('/userProfile/{userid}/followed/{followedid}').onWrite((event) => {
  const collectionRef = event.data.ref.parent;
  const countRef = collectionRef.parent.child('profile/followed_count');

  let increment;
  if (event.data.exists() && !event.data.previous.exists()) {
    increment = 1;
  } else if (!event.data.exists() && event.data.previous.exists()) {
    increment = -1;
  } else {
    return null;
  }

  // Return the promise from countRef.transaction() so our function
  // waits for this async event to complete before it exits.
  return countRef.transaction((current) => {
    return (current || 0) + increment;
  }).then(() => {
    return console.log('Counter updated.');
  });
});
