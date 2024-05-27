// server.js
require("dotenv").config();
const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./Routes");
// const socket = require('./socket');

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// MongoDB connection
const DB = process.env.MONGODB_URI;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connection successful");
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });

// Initialize Socket.IO
// const io = socket.init(server);

// io.on("connection", (socket) => {
//     console.log("A user connected");

//     socket.on("typing", (data) => {
//         console.log("Received typing event from client:", data);
//         socket.broadcast.emit("typing", data);
//     });

//     socket.on("stopTyping", (data) => {
//         console.log("Received stopTyping event from client:", data);
//         socket.broadcast.emit("stopTyping", data);
//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected");
//     });
// });

app.use("/", routes);

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

module.exports = app;
