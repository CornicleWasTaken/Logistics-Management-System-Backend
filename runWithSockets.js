import http from "http";
import dotenv from "dotenv";
import app from "./server.js";
import { initSocket } from "./sockets/trackingSocket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// initialize socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`LOMS Backend (with sockets) listening on port ${PORT}`);
});
