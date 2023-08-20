require("dotenv").config();
const User = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // node
const Task = require("../Models/tasks");

const secretKey = process.env.SECRET_KEY;

// Create a new user
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

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user with the given username
    const user = await User.findOne({ email });

    if (user) {
      const userPassword = user.password == undefined ? "" : user.password;
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, userPassword);

      if (passwordMatch) {
        // Create a JWT token
        // @ts-ignore
        const token = jwt.sign({ userId: user._id }, secretKey, {
          expiresIn: "1h",
        });

        const { _id, name, tags } = user;

        res.json({ token, userId: _id, name, tags });
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
      const userData = { name: user.name, email: user.email };
      res.json(userData);
    })
    .catch((err) => {
      console.error("Error retrieving user data:", err);
      res.status(500).json({ error: "Failed to retrieve user data" });
    });
};

// update the user
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const tag = req.body.tag;
  const type = req.body.type;
  const photo = req.body.photo;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If photo data is provided, update photo and return
    if (photo) {
      user.picture = photo;
      await user.save();
      return res.json({ user, message: "Photo updated successfully" });
    }

    // If tag data is provided, handle tag addition or deletion
    if (tag && type) {
      if (type == "add") {
        user.tags.push(tag);
      } else if (type == "delete") {
        const index = user.tags.indexOf(tag);
        if (index > -1) {
          user.tags.splice(index, 1);
          // Update tasks where user == userId and tag == tag
          try {
            const result = await Task.updateMany(
              { user: userId, tag: tag },
              { $set: { tag: "" } }
            );
            console.log(result);
            console.log(`Tags updated for tasks linked to user ${userId}`);
          } catch (error) {
            console.error("Error updating tags:", error);
          }
        } else {
          return res.status(404).json({ error: "Tag not found" });
        }
      }
    }

    await user.save();
    return res.json({ user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// delete user
const deleteUser = (req, res) => {
  // Logic to delete a user by ID
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

// check if token expired or not
const verifyToken = async (req, res) => {
  const { token } = req.body;
  try {
    // @ts-ignore
    const decoded = jwt.verify(token, secretKey);
    return res.json({ decoded: decoded });
  } catch (error) {
    // Token has expired or is invalid
    return res.json({ error: error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  login,
  googleLogin,
  updateUser,
  deleteUser,
  verifyToken,
};
