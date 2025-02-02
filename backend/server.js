// Import necessary modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const multer = require("multer");
const cron = require("node-cron");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const archiveMessages = require("./utils/archiveMessages");

// Load environment variables
dotenv.config({ path: "./backend/config/config.env" });

// Connect to the database
connectDB();

// Create an Express application
const app = express();

// Middleware for Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware for parsing JSON in request bodies
app.use(express.json());

// Multer configuration
// const memoryStorage = multer.memoryStorage();

// Multer middleware for file upload
// app.use(multer({ storage: memoryStorage }).single("file"));
app.use(express.static("./public"));

// Define routes
const auth = require("./routes/auth");
const user = require("./routes/user");
const chat = require("./routes/chat");
const message = require("./routes/message");

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/chat", chat);
app.use("/api/v1/message", message);

// ErrorHandler middleware
app.use(errorHandler);

// Define the port for the server
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
const server = app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`)
);

// Socket.io setup
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log(`User is connected with id: ${socket.id}`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("USER DATA / user:", userData);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
    // console.log("ROOM JOINED / selectedChat._id:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

  socket.on("new-message", (receivedMessage) => {
    // check which chat(room) does this belongs to
    var chat = receivedMessage.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) =>
      user._id !== receivedMessage.sender._id
        ? socket.in(user._id).emit("received-message", receivedMessage)
        : null
    );
  });

  socket.off("setup", () => {
    // console.log("Socket Disconnected!");
    socket.leave(userData._id);
  });
});

// Schedule the archiving job to run every night at midnight
cron.schedule("0 0 * * *", archiveMessages);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
