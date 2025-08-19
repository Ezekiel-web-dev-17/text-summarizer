"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const local_config_1 = require("./config/local.config");
const dbConnect_1 = require("./database/dbConnect");
const app = (0, fastify_1.default)({
    logger: true,
});
// Declare a route
app.get("/", async (request, reply) => {
    reply.send({ message: "Hello World" });
});
const port = { port: Number(local_config_1.PORT) };
// Run the server!
app.listen(port, async function (err, address) {
    await (0, dbConnect_1.DBConnect)();
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
});
