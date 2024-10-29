import express from "express";
import socketSetup from "./socket.js";
import redis from "./config/ioredis.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import "dotenv/config";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:8000",
      "http://localhost:9000",
    ],
    credentials: true,
  },
  adapter: createAdapter(redis),
});

socketSetup(io);

app.get("/", (req, res) => res.send("Hello from Express!"));

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log("Express server is running on port " + PORT);
});
