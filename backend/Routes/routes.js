const express = require("express");
const Router = express.Router()
const jwt = require("jsonwebtoken");

const slotD = require("../models/slot");
const bookA = require("../models/bookings");
const User = require("../models/user")


//Register
Router.post("/register", async (req, res) => {
    const query1 = User.where('username',"==",req.body.username).get();
    const query2 = User.where('email',"==",req.body.email).get();
  
    const [res1,res2] = await Promise.all([query1,query2]);
  
    const data = res1.docs.length + res2.docs.length
  
    if (data !== 0) {
      res.status(400).json("Username or Email is already in use.");
    } else {
      await User.add(req.body)
  
      res.status(200).json("Registered Successfully.");
    }
  });
  
  //login
  Router.post("/login", async (req, res) => {
    let data = await User.where('username',"==",req.body.username).get();
  
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
  Router.get("/getProfile", authenticateToken, async (req,res)=>{
    
    const username = req.user.username

    let data = await User.where("username","==",username).get();
    data = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    if(data.length === 0)
    {
      res.status(400).json("User not found.")
    }
    else
    {
      res.status(200).json(data[0])
    }
  
  })
  
  
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

  module.exports = Router