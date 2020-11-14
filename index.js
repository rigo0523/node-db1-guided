const express = require("express");
const welcomeRouter = require("./welcome/welcome-router");
const messagesRouter = require("./messages/messages-router");

const server = express();
const port = process.env.PORT || 4000;

server.use(express.json());
server.use("/", welcomeRouter);
server.use("/api/messages", messagesRouter);

//middleware for CATCH ERROR on all endpoints of /api/messages
server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "500 error: Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
