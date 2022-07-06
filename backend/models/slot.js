var admin = require("firebase-admin");

var serviceAccount = require("F:/React/Task3/backend/appointment-fa4a0-firebase-adminsdk-5r2ib-b7aa936245.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const slotDetail = db.collection("Slots");
module.exports = slotDetail;