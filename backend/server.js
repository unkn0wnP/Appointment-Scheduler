const express = require("express");
const cors = require("cors");
const slotD = require("./models/slot");
const bookA = require("./models/bookings");
const config = require("../config/const.js");
const path = require("path");

const PORT = process.env.PORT || 3001
const app = express();


app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

app.use(express.json());
app.use(cors());

const duration = config.duration;
const start = config.start;
const end = config.end;
app.post("/getSlotCount", async (req, res) => {
  const d = req.body.date;
  const data = await slotD.where("date", "==", d).get();
  const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send({ n: list.length });
});

app.post("/createSlot", async (req, res) => {
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

app.post("/getFreeSlot", async (req, res) => {
  const d = req.body.date;
  const minute = req.body.minute;

  const n = Math.ceil(minute / duration)

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

app.post("/bookSlot", async (req, res) => {
  let t = parseInt(req.body.time);
  const d = req.body.date;
  const name = req.body.name;
  const minute = parseInt(req.body.minute);

  const n = Math.ceil(minute / duration)

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

app.post("/getBookings", async (req, res) => {
  const date1 = req.body.date1;
  const date2 = req.body.date2;
  const data = await bookA.orderBy("date").orderBy("time").where("date",">=",date1).where("date","<=",date2).get();
  const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});

app.listen(PORT, () => {
  console.log("Server is running...");
});
