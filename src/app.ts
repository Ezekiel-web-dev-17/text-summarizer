import Fastify from "fastify";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PORT } from "./config/local.config";
import { DBConnect } from "./database/dbConnect";

interface Port {
  port: number;
}

const app = Fastify({
  logger: true,
});

// Declare a route
app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: "Hello World" });
});

const port: Port = { port: Number(PORT) };
// Run the server!
app.listen(port, async function (err, address) {
  await DBConnect();
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
