import Fastify from "fastify";
import { PORT } from "./config/local.config";
import { DBConnect } from "./database/dbConnect";

const app = Fastify({
  logger: true,
});

// Declare a route
app.get("/", function (request, reply) {
  reply.send("Hello world");
});

// Run the server!
app.listen({ port: Number(PORT) }, async function (err, address) {
  await DBConnect();
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
