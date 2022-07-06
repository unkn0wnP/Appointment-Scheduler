var admin = require("firebase-admin");

const db = admin.firestore();
const slotDetail = db.collection("Bookings");
module.exports = slotDetail;