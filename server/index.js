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
    UserModel.findOne({ email: email }).then(user => {
        if (user) {
            if (user.password === password) {
                res.json("Success");
            }
            else {
                res.json("Password incorrect");
            }
        }
        else {
            res.json("No user exists");
        }
    })
        .catch(err => console.log(err));
})
app.post("/signup",(req, res)=> {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err=>res.json(err))
})

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));