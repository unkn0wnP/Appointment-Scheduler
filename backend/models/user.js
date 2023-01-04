var admin = require("firebase-admin");

const db = admin.firestore();
const userDetail = db.collection("User");
module.exports = userDetail;