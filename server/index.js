require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const UserModel = require('./models/User.js')


// database connection

// middlewares
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.DB);
app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    UserModel.findOne({ email: email })
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(404).json({ error: "User not found" });
        }
  
        if (user.password !== password) {
          // Incorrect password
          return res.status(401).json({ error: "Incorrect password" });
        }
  
        // Successful login
        // You can generate a token, set up a session, or perform any other login-related actions here
        res.json({ message: "Login successful" });
      })
      .catch((err) => res.status(500).json(err));
  });
app.post("/signup", (req, res) => {
    const { email, password, Name } = req.body;
  
    // Check if a user with the provided email already exists
    UserModel.findOne({ email: email })
      .then((user) => {
        if (user) {
          // User already exists
          return res.status(409).json({ error: "User already exists" });
        }
  
        // Create a new user
        UserModel.create({ email, password, Name })
          .then((newUser) => res.json(newUser))
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  });

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));