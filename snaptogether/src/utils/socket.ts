import { io, Socket } from "socket.io-client";

const socket: Socket = io(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}`, {
  transports: ["websocket"],
  withCredentials: true, // ✅ Ensures CORS doesn't block WebSocket
  reconnection: true, // ✅ Auto-reconnect if connection is lost
  reconnectionAttempts: 5, // ✅ Retry 5 times
  reconnectionDelay: 2000, // ✅ Wait 2 seconds before retrying
});

socket.on("connect", () => {
  console.log("✅ WebSocket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.error("❌ WebSocket Disconnected:", reason);
});

export default socket;
