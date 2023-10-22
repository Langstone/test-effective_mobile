import { fastifyPlugin } from 'fastify-plugin';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const client = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})
const dbconnector = async (app, options) => {
    try {
        await client.connect();
        console.log("db connected succesfully");
        app.decorate('db', {client});
    } catch(err) {
        console.error(err)
    }
}
export default fastifyPlugin(dbconnector);
