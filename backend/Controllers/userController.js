require("dotenv").config();
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // node
const Task = require("../Models/task");

const secretKey = process.env.SECRET_KEY;

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password, picture } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already Registerd" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({ name, email, password: hashedPassword, picture });
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('tags');

    if (user) {
      const userPassword = user.password == undefined ? "" : user.password;
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, userPassword);

      if (passwordMatch) {
        // Create a JWT token
        // @ts-ignore
        const token = jwt.sign({ userId: user._id }, secretKey, {
          expiresIn: "1w",
        });

        const { _id, name, picture, email, filter, tags } = user;

        res.json({ _id, name, picture, email, filter, tags, token });
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
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).populate('tags');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // User data retrieved successfully
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      filter: user.filter,
      tags: user.tags.map(tag => ({
        _id: tag._id,
        name: tag.name,
        color: tag.color
      }))
    });
  } catch (err) {
    console.error("Error retrieving user data:", err);
    res.status(500).json({ error: "Failed to retrieve user data" });
  }
};

// update the user
const updatePhoto = async (req, res) => {
  const userId = req.params.id;
  const photo = req.body.photo;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!photo) {
      return res.status(400).json({ error: "Photo data is required" });
    }

    user.picture = photo;
    await user.save();
    return res.json({ message: "Photo updated successfully" });
  } catch (error) {
    console.error("Error updating photo:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to update user's filter
const updateFilter = async (req, res) => {
  const userId = req.params.id;
  const filter = req.body.filter;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!filter) {
      return res.status(400).json({ error: "Filter data is required" });
    }

    user.filter = filter;
    await user.save();
    return res.json({ message: "Filter updated successfully" });
  } catch (error) {
    console.error("Error updating filter:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// delete user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find tasks associated with the user and delete
    await Task.deleteMany({ user: userId });

    // Delete the user
    await user.deleteOne();

    return res.json({ message: "User and associated tasks deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete user and associated tasks" });
  }
};


const getAllUsers = (req, res) => {
  // Logic to get all users
};

// google login
const googleLogin = async (req, res) => {
  const { token } = req.body;
  // @ts-ignore
  const result = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
  );

  const { sub, email, name, picture } = result.data;
  try {
    // check googleUser already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // if exists then take previous data
      const { _id, name, tags, picture } = existingUser;

      res.json({ token, userId: _id, name, tags, picture,email });
    } else {
      // if new user then add user data to DB
      const newUser = new User({
        googleId: sub,
        name: name,
        email: email,
        picture: picture,
      });

      await newUser
        .save()
        .then(() => {
          const { _id, name, tags, picture } = newUser;
          res.json({ token, userId: _id, name, tags, picture,email });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error });
  }
};

// Get all users' names and IDs
const getAllUserNamesAndIds = async (req, res) => {
  try {
    // Query the database to retrieve all users with names and IDs
    const users = await User.find({}, '_id name picture');

    // Return the array of users with names and IDs
    res.json(users);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Failed to retrieve user names and IDs" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  login,
  googleLogin,
  updatePhoto,
  updateFilter,
  deleteUser,
  getAllUserNamesAndIds
};
