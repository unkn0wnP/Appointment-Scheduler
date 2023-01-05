const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../../config/const")

const slotD = require("../models/slot");
const bookA = require("../models/bookings");
const User = require("../models/user");

const duration = config.duration;
const start = config.start;
const end = config.end;

//Register
Router.post("/register", async (req, res) => {
  const query1 = User.where("username", "==", req.body.username).get();
  const query2 = User.where("email", "==", req.body.email).get();

  const [res1, res2] = await Promise.all([query1, query2]);

  const data = res1.docs.length + res2.docs.length;

  if (data !== 0) {
    res.status(400).json("Username or Email is already in use.");
  } else {
    await User.add(req.body);

    res.status(200).json("Registered Successfully.");
  }
});

//login
Router.post("/login", async (req, res) => {
  let data = await User.where("username", "==", req.body.username).get();

  data = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (data.length === 0) {
    res.status(400).json("User not found.");
  } else if (req.body.password !== data[0].password) {
    res.status(400).json("Invalid password.");
  } else {
    const user = { username: req.body.username };

    //JSON web token
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
    res.json({ accessToken: accessToken });
  }
});

//get Profile
Router.get("/getProfile", authenticateToken, async (req, res) => {
  const username = req.user.username;

  let data = await User.where("username", "==", username).get();
  data = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (data.length === 0) {
    res.status(400).json("User not found.");
  } else {
    res.status(200).json(data[0]);
  }
});

//get Bookings
Router.post("/getBookings", authenticateToken, async (req, res) => {
  const date1 = req.body.date1;
  const date2 = req.body.date2;
  const data = await bookA
    .orderBy("date")
    .orderBy("time")
    .where("date", ">=", date1)
    .where("date", "<=", date2)
    .get();
  const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});


Router.post("/getSlotCount",authenticateToken, async (req, res) => {
  const d = req.body.date;
  const data = await slotD.where("date", "==", d).get();
  const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send({ n: list.length });
});

Router.post("/createSlot",authenticateToken, async (req, res) => {
  const date = req.body.date;
  let t = start;
  let c = 0;
  while (t + duration <= end) {
    const data = {
      date: date,
      time: t,
      status: false,
    };
    await slotD.add(data);
    t = t + duration;
    c++;
  }
  res.send({ item: c });
});

Router.post("/getFreeSlot",authenticateToken, async (req, res) => {
  const d = req.body.date;
  const minute = req.body.minute;

  const n = Math.ceil(minute / duration);

  let result = [];
  let t = start;
  while (t + n * duration <= end) {
    const data = await slotD
      .where("date", "==", d)
      .where("time", ">=", t)
      .where("time", "<", t + n * duration)
      .where("status", "==", false)
      .get();
    const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (list.length == n) {
      result = result.concat(list[0]);
    }
    t = t + duration;
  }
  res.send(result);
});

Router.post("/bookSlot", authenticateToken,async (req, res) => {
  let t = parseInt(req.body.time);
  const d = req.body.date;
  const name = req.user.username;
  const minute = parseInt(req.body.minute);

  const n = Math.ceil(minute / duration);

  const data = {
    name: name,
    date: d,
    time: t,
    duration: minute,
  };
  await bookA.add(data);
  for (i = 0; i < n; i++) {
    const data = await slotD
      .where("date", "==", d)
      .where("time", "==", t)
      .get();
    const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    await slotD.doc(list[0].id).update({ status: true });

    t = t + duration;
  }

  res.send({ msg: "Done" });
});

//jwt token authentication
function authenticateToken(req, res, next) {
  if (req.headers.hasOwnProperty("authorization") === false) {
    res.status(403);
  } else {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === "null") return res.status(403);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  }
}

module.exports = Router;
