import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

import app from "./app";
import { connectDB } from "./config/database";
import { initSocket } from "./sockets/socket";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const httpServer = createServer(app);
  
  // Initialize Socket.io WebSockets
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log("================================");
    console.log("🚀 CrowdShield AI Backend");
    console.log(`🌐 Server running on port ${PORT}`);
    console.log("================================");
  });
};

startServer();
