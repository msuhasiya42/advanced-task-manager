// import User from "./users";
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongodb connections
// Define your routes and logic here

const DB = process.env.MONGODB_URL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log(err + "connection failed");
  });

// User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check password
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Successful login
  return res.json({ message: "Login successful" });
});

// Sign up
app.post("/signup", async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  // const userExists = User.find((user) => user.email === email);

  // if (userExists) {
  //   return res.status(409).json({ message: "User already exists" });
  // }

  // Create new user
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }

  // User registration successful
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
