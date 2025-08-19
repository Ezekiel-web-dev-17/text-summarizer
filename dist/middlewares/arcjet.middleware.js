"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importStar(require("@arcjet/node"));
const inspect_1 = require("@arcjet/inspect");
const node_http_1 = __importDefault(require("node:http"));
const aj = (0, node_1.default)({
    key: process.env.ARCJET_KEY, // Get your site key from https://app.arcjet.com
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        (0, node_1.shield)({ mode: "LIVE" }),
        // Create a bot detection rule
        (0, node_1.detectBot)({
            mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
            // Block all bots except the following
            allow: [
                "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
                // Uncomment to allow these other common bot categories
                // See the full list at https://arcjet.com/bot-list
                //"CATEGORY:MONITOR", // Uptime monitoring services
                //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
        }),
        // Create a token bucket rate limit. Other algorithms are supported.
        (0, node_1.tokenBucket)({
            mode: "LIVE",
            // Tracked by IP address by default, but this can be customized
            // See https://docs.arcjet.com/fingerprints
            //characteristics: ["ip.src"],
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});
const server = node_http_1.default.createServer(async function (req, res) {
    const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);
    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            res.writeHead(429, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Too many requests" }));
        }
        else if (decision.reason.isBot()) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "No bots allowed" }));
        }
        else {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Forbidden" }));
        }
    }
    else if (decision.ip.isHosting()) {
        // Requests from hosting IPs are likely from bots, so they can usually be
        // blocked. However, consider your use case - if this is an API endpoint
        // then hosting IPs might be legitimate.
        // https://docs.arcjet.com/blueprints/vpn-proxy-detection
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Forbidden" }));
    }
    else if (decision.results.some(inspect_1.isSpoofedBot)) {
        // Paid Arcjet accounts include additional verification checks using IP data.
        // Verification isn't always possible, so we recommend checking the decision
        // separately.
        // https://docs.arcjet.com/bot-protection/reference#bot-verification
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Forbidden" }));
    }
    else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Hello world" }));
    }
});
server.listen(8000);
