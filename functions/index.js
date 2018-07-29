const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.sendMessageNotification = functions.database.ref('conversations/{conversationID}/messages/{messageID}').onWrite(event => {
  if (event.data.previous.exists()) {
    return;
  }

firebase.database().ref('messages').child(event.params.messageID).once('value').then(function(snap) {
    var messageData = snap.val();

var topic = 'notifications_' + messageData.receiverKey;
    var payload = {
      notification: {
        title: "You got a new Message",
        body: messageData.content,
      }
    };
    
    admin.messaging().sendToTopic(topic, payload)
        .then(function(response) {
          console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
          console.log("Error sending message:", error);
        });
  });
});
