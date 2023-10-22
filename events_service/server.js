import { fastify } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify();
const start = async () => {
  app
    .listen({port: process.env.APP_PORT}, error => console.error(error));
}
export { app, start };