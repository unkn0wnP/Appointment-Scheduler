var admin = require("firebase-admin");

const db = admin.firestore();
const refreshToken = db.collection("RefreshToken");
module.exports = refreshToken;
