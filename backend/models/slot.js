var admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const slotDetail = db.collection("Slots");
module.exports = slotDetail;