const User = require("./Models/users");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
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

// Sign up route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already Registerd" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the given username
    const user = await User.findOne({ email });

    if (user) {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, "secret_key");

        res.json({ token });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
