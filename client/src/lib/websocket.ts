import { queryClient } from "./queryClient";

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export function connectWebSocket() {
  if (ws) return;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsPath = `${protocol}//${window.location.host}/ws`;

  try {
    ws = new WebSocket(wsPath);

    ws.onopen = () => {
      console.log("WebSocket connected");
      reconnectAttempts = 0;
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "listing_accepted" || message.type === "listing_expired") {
          queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      ws = null;

      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
        setTimeout(connectWebSocket, timeout);
      }
    };
  } catch (err) {
    console.error("Failed to create WebSocket connection:", err);
  }
}