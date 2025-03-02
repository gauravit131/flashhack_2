import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { Listing } from "@shared/schema";

type WSMessage = {
  type: "listing_accepted" | "listing_expired";
  listing: Listing;
};

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: "/ws",
    perMessageDeflate: false
  });

  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    clients.add(ws);

    ws.on("error", console.error);

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
    });
  });

  return {
    broadcast: (message: WSMessage) => {
      console.log(`Broadcasting message: ${message.type}`);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    },
  };
}