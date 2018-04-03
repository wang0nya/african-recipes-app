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

// Keeps track of the length of the 'likes' child list in a separate property.
exports.countlikeschange = functions.database.ref('/recipeList/{recipeid}/likes/{userid}').onWrite((event) => {
  const likes_collectionRef = event.data.ref.parent;
  const likes_countRef = likes_collectionRef.parent.child('likes_count');

  let likes_increment;
  if (event.data.exists() && !event.data.previous.exists()) {
    likes_increment = 1;
  } else if (!event.data.exists() && event.data.previous.exists()) {
    likes_increment = -1;
  } else {
    return null;
  }

  // Return the promise from countRef.transaction() so our function
  // waits for this async event to complete before it exits.
  return likes_countRef.transaction((likes_current) => {
    return (likes_current || 0) + likes_increment;
  }).then(() => {
    return console.log('likes_Counter updated.');
  });
});

// Keeps track of the length of the 'comments' child list in a separate property.
exports.countcommentschange = functions.database.ref('/recipeList/{recipeid}/comments/{commentid}').onWrite((event) => {
  const comments_collectionRef = event.data.ref.parent;
  const comments_countRef = comments_collectionRef.parent.child('comments_count');

  let comments_increment;
  if (event.data.exists() && !event.data.previous.exists()) {
    comments_increment = 1;
  } else if (!event.data.exists() && event.data.previous.exists()) {
    comments_increment = -1;
  } else {
    return null;
  }

  // Return the promise from countRef.transaction() so our function
  // waits for this async event to complete before it exits.
  return comments_countRef.transaction((comments_current) => {
    return (comments_current || 0) + comments_increment;
  }).then(() => {
    return console.log('comments_Counter updated.');
  });
});
