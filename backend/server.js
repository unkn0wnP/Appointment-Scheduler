const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const Router = require("./Routes/routes");

const PORT = process.env.PORT || 3001;
const app = express();

const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsConfig));
app.use("/", Router);

app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server is running...");
});
