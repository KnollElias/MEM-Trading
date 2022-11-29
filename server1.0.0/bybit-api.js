const { WebsocketClient } = require("bybit-api");

const API_KEY = "xxx";
const PRIVATE_KEY = "yyy";

const wsConfig = {
  key: API_KEY,
  secret: PRIVATE_KEY,

  /*
  The following parameters are optional:
  */

  // defaults to true == livenet
  // testnet: false

  // NOTE: to listen to multiple markets (spot vs inverse vs linear vs linearfutures) at once, make one WebsocketClient instance per market

  market: "linear",
  // market: "inverse",
  // market: "spot",
  // market: "spotv3",
  // market: "usdcOption",
  // market: "usdcPerp",
  // market: "unifiedPerp",
  // market: "unifiedOption",

  // how long to wait (in ms) before deciding the connection should be terminated & reconnected
  pongTimeout: 1000,

  // how often to check (in ms) that WS connection is still alive
  pingInterval: 10000,

  // how long to wait before attempting to reconnect (in ms) after connection is closed
  reconnectTimeout: 500,

  // config options sent to RestClient (used for time sync). See RestClient docs.
  // restOptions: { },

  // config for axios used for HTTP requests. E.g for proxy support
  // requestOptions: { }

  // override which URL to use for websocket connections
  // wsUrl: "wss://stream.bytick.com/realtime"
};

const ws = new WebsocketClient(wsConfig);

// subscribe to multiple topics at once
ws.subscribe(["position", "execution", "trade"]);

// and/or subscribe to individual topics on demand
ws.subscribe("kline.BTCUSD.1m");

// Listen to events coming from websockets. This is the primary data source
ws.on("update", data => {
  console.log("update", data);
});

// Optional: Listen to websocket connection open event (automatic after subscribing to one or more topics)
ws.on("open", ({ wsKey, event }) => {
  console.log("connection open for websocket with ID: " + wsKey);
});

// Optional: Listen to responses to websocket queries (e.g. the response after subscribing to a topic)
ws.on("response", response => {
  console.log("response", response);
});

// Optional: Listen to connection close event. Unexpected connection closes are automatically reconnected.
ws.on("close", () => {
  console.log("connection closed");
});

// Optional: Listen to raw error events. Recommended.
ws.on("error", err => {
  console.error("error", err);
});