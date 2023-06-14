const User = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Logic to create a new user
const createUser = async (req, res) => {
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
};

const login = async (req, res) => {
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
        const userId = user._id;
        res.json({ token, userId });
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
};

// Get user by id
const getUserById = async (req, res) => {
  // Logic to get a user by ID
  const userId = req.params.id; // Retrieve the user ID from the route parameters
  // Query the database to retrieve the user data based on the user ID
  await User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // User data retrieved successfully
      res.json(user);
    })
    .catch((err) => {
      console.error("Error retrieving user data:", err);
      res.status(500).json({ error: "Failed to retrieve user data" });
    });
};

// update the user
const updateUser = (req, res) => {
  // Logic to update a user by ID
};

// delete user
const deleteUser = (req, res) => {
  // Logic to delete a user by ID
};

const getAllUsers = (req, res) => {
  // Logic to get all users
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  deleteUser,
};
