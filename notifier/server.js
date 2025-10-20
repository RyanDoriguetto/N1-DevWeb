import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  // Cliente Angular pode escutar 'order-status'
});

app.post("/events/order-status", (req, res) => {
  io.emit("order-status", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Notifier on :${PORT}`));
