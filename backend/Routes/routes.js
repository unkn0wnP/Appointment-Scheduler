const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../../config/const");
const bcrypt = require("bcryptjs");
const slotD = require("../models/slot");
const bookA = require("../models/bookings");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const { sendConfirmationMail } = require("../../frontend/src/services/email");

const duration = config.duration;
const start = config.start;
const end = config.end;

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
const ACCESS_TOKEN_TIME = process.env.ACCESS_TOKEN_TIME;
const REFRESH_TOKEN_TIME = process.env.REFRESH_TOEKN_TIME;

//validate Login
Router.get("/validatelogin", authenticateToken, (req, res) => {
  return res.status(200).json("Valid Login.");
});

//email confirmation
Router.get("/verify/:confirmationcode", async (req, res) => {
  let data = await User.where(
    "confirmationcode",
    "==",
    req.params.confirmationcode
  ).get();
  data = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (!data) {
    return res.status(404).json("user not found.");
  } else {
    await User.doc(data[0].id).update({ status: "Active" });
  }
});

//Register
Router.post("/register", async (req, res) => {
  const query1 = User.where("username", "==", req.body.username).get();
  const query2 = User.where("email", "==", req.body.email).get();

  const [res1, res2] = await Promise.all([query1, query2]);

  const data = res1.docs.length + res2.docs.length;

  if (data !== 0) {
    return res.status(400).json("Username or Email is already in use.");
  } else {
    sendConfirmationMail(
      req.body.username,
      req.body.email,
      req.body.confirmationcode
    );

    let userData = req.body;

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    await User.add(userData);

    return res.status(200).json("Registered Successfully.");
  }
});

//login
Router.post("/login", async (req, res) => {
  let data = await User.where("username", "==", req.body.username).get();

  data = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (data.length === 0) {
    return res.status(400).json("User not found.");
  } else if (data[0].status !== "Active") {
    res
      .status(400)
      .json("Account verification is pending. Please Verify Your Email!");
  } else {
    const validCred = await bcrypt.compare(req.body.password, data[0].password);
    if (!validCred) {
      return res.status(400).json("Invalid password.");
    } else {
      const user = { username: req.body.username };

      //JSON web token
      const accessToken = jwt.sign(user, ACCESS_TOKEN_KEY, {
        expiresIn: ACCESS_TOKEN_TIME,
      });
      const refreshToken = jwt.sign(user, REFRESH_TOKEN_KEY, {
        expiresIn: REFRESH_TOKEN_TIME,
      });

      await RefreshToken.add({ token: refreshToken });

      return res.json({ accessToken, refreshToken });
    }
  }
});

//refresh tokens
Router.get("/refreshToken", async (req, res) => {
  if (req.headers.hasOwnProperty("authorization") === false) {
    return res.status(403).json("No authorization header found.");
  } else {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1];

    if (refreshToken === "null")
      return res.status(403).json("No refresh token found.");

    let token = await RefreshToken.where("token", "==", refreshToken).get();
    token = token.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (token.length === 0) {
      return res.status(403).json("Invalid refresh token.");
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_KEY, (err, user) => {
      if (err) {
        RefreshToken.doc(token[0].id).delete();
        return res.status(403).json("Refresh token expired.");
      }
      const accessToken = jwt.sign(
        { username: user.username },
        ACCESS_TOKEN_KEY,
        {
          expiresIn: ACCESS_TOKEN_TIME,
        }
      );
      return res.status(200).json({ accessToken: accessToken });
    });
  }
});

//logout
Router.delete("/logout", async (req, res) => {
  if (req.headers.hasOwnProperty("authorization") === false) {
    return res.status(403).json("No authorization header found.");
  } else {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1];

    if (refreshToken === "null") return res.status(403).json("Not logged In.");

    let token = await RefreshToken.where("token", "==", refreshToken).get();
    token = token.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (token.length === 0) {
      return res.status(403).json("Invalid refresh token.");
    }

    await RefreshToken.doc(token[0].id).delete();
    res.status(200).json("Logged out successfully.");
  }
});

//get Profile
Router.get("/getProfile", authenticateToken, async (req, res) => {
  const username = req.user.username;

  let data = await User.where("username", "==", username).get();
  data = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (data.length === 0) {
    return res.status(400).json("User not found.");
  } else {
    return res.status(200).json(data[0]);
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
  return res.send(list);
});

Router.post("/getSlotCount", authenticateToken, async (req, res) => {
  const d = req.body.date;
  const data = await slotD.where("date", "==", d).get();
  const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return res.send({ n: list.length });
});

Router.post("/createSlot", authenticateToken, async (req, res) => {
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
  return res.send({ item: c });
});

Router.post("/getFreeSlot", authenticateToken, async (req, res) => {
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
  return res.send(result);
});

Router.post("/bookSlot", authenticateToken, async (req, res) => {
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

  return res.send({ msg: "Done" });
});

//jwt token authentication
function authenticateToken(req, res, next) {
  if (req.headers.hasOwnProperty("authorization") === false) {
    return res.status(403);
  } else {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === "null") return res.status(403);

    jwt.verify(token, ACCESS_TOKEN_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  }
}

module.exports = Router;
