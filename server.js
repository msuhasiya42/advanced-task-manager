const express = require("express");
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sample user data
const users = [
  { name: "Mayur Suhasiya", email: "mayur@gmail.com", password: "mayur" },
  { name: "Raksha Jain", email: "raksha@gmail.com", password: "raksha" },
];

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

// Sign up route
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = {
    name,
    email,
    password,
  };

  users.push(newUser);

  // User registration successful
  return res.status(201).json({ message: "User registered successfully" });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
