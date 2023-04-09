import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import "./addRequire.js";
import { updateMessageStatus } from "./controllers/message.controller.js";
const http = require('http');
const FileReader = require('filereader');

const { writeFile } = require("fs");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    maxHttpBufferSize: 1e8,
  },
});

let activeUsers = [];

let fileShare={}

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      // console.log("New User Connected", activeUsers);
      updateMessageStatus(newUserId, "delivered");
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  socket.on("offline", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // typing status
  socket.on("typing", (data) => {
    const user = activeUsers.find((user) => user.userId === data.receiverId);
    if(user) {
      io.to(user.socketId).emit("get-typing", data);
      // console.log("typing: " + data)      
    }
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    data.status = "sent"
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }

    console.log("--------------------");
  });

  socket.on("message-seen-status", (data) => {
    console.log("-------SEEN-------")
    data.status = "seen";
    updateMessageStatus(data.chatId, data.status);
    console.log("Message seen by: ", data)
    io.emit("message-seen", data);
  })

  socket.on("upload", ({file, receiverId}) => {
    console.log("--file: ",file);

    const user = activeUsers.find((user) => user.userId === receiverId);
    // io.to(user.socketId).emit("receive-upload", file);

    console.log("okunuyor")
    console.log("file size: ", file.size)

    io.to(user.socketId).emit("receive-upload", file);


  });


});


// routes
import AuthRoute from './routes/auth.route.js'
import UserRoute from './routes/user.route.js'
import ChatRoute from './routes/chat.route.js'
import MessageRoute from './routes/message.route.js'



// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// to serve images inside public folder
app.use(express.static('public')); 
app.use('/images', express.static('images'));


dotenv.config();
const PORT = process.env.PORT;

const CONNECTION =process.env.MONGODB_CONNECTION;
mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server.listen(5000, () => console.log(`Listening at Port ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));


app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)