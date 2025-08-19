"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const local_config_1 = require("./config/local.config");
const app = (0, fastify_1.default)({
    logger: true,
});
// Declare a route
app.get("/", function (request, reply) {
    reply.send("Hello world");
});
// Run the server!
app.listen({ port: Number(local_config_1.PORT) }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
});
