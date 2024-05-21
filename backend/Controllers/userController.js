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
          expiresIn: "1w",
        });

        const { _id, name, tags, picture, email,filter } = user;

        res.json({ _id, name, tags, picture, email, filter, token });
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
  const type = req.body.type;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!type) {
      return res.status(400).json({ error: "Type field is required" });
    }

    switch (type) {
      case "photo":
        const photo = req.body.photo;
        if (!photo) {
          return res.status(400).json({ error: "Photo data is required" });
        }
        user.picture = photo;
        await user.save();
        return res.json({ message: "Photo updated successfully" });

      case "filter":
        const filter = req.body.filter;
        if (!filter) {
          return res.status(400).json({ error: "Filter data is required" });
        }
        user.filter = filter;
        await user.save();
        return res.json({ message: "Filter updated successfully" });

      case "tag":
        const tags = req.body.tags;
        if (!tags || !Array.isArray(tags)) {
          return res.status(400).json({ error: "Tags data is required and should be an array" });
        }

        // Validate each tag object
        for (const tag of tags) {
          if (!tag.name || !tag.color) {
            return res.status(400).json({ error: "Each tag must have a name and a color" });
          }
        }

        user.tags = tags;
        await user.save();
        return res.json({ message: "Tags updated successfully" });

      default:
        return res.status(400).json({ error: "Invalid type" });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update user" });
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
  updateUser,
  deleteUser,
  verifyToken,
  getAllUserNamesAndIds
};
