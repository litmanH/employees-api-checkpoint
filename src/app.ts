import cors from '@fastify/cors';
import { FastifyInstance } from "fastify";
import knexPlugin from "./plugins/knex";
import redisPlugin from "./plugins/redis";
import routes from "./routes";

const env = process.env.ENVIRONMENT ?? "development";

async function app(fastify: FastifyInstance) {
  fastify.register(knexPlugin);
  fastify.register(redisPlugin);
  fastify.register(cors)
  fastify.register(routes);

  console.log(`✅ fastify instance configured (env: ${env})\n`);
}

export default app;
