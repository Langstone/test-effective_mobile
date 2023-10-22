import axios from 'axios'
import dotenv from 'dotenv';
import userSchema from './schema.js'

dotenv.config();

async function routes(app, options) {
  const db = app.db.client;
  app
    .get('/users', { schema: userSchema }, async (request, reply) => {
      try {
          const {rows} = await db.query('SELECT * FROM users');
          reply.send(rows);
      } catch(err) {
          throw new Error(err)
      }
    })
    .post('/users', { schema: userSchema }, async (request, reply) => {
      const { first_name, last_name, email } = request.body;
      const query = {
        text: `INSERT INTO users (first_name, last_name, email) VALUES($1, $2, $3) RETURNING id, first_name, last_name, email`,
        values: [first_name, last_name, email],
      }
      try {
        const { rows: [ createdUser ] } = await db.query(query);
        const payload = JSON.stringify({first_name, last_name, email});
        await axios.post(process.env.EVENTS_SERVICE_REPORT_URL, { user_id: createdUser.id, payload, operation: 'CREATE' });
        reply.code(201).send(createdUser);
      } catch(err) {
        throw new Error(err);
      }
    })
    .put('/users/:id', { schema: userSchema }, async (request, reply) => {
      const { first_name, last_name, email } = request.body;
      const query = {
        text: `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING id, first_name, last_name, email`,
        values: [first_name, last_name, email, request.params.id],
      }
      try {
        const { rows: [ updatedUser ] } = await db.query(query);
        const payload = JSON.stringify({first_name, last_name, email});
        await axios.post(process.env.EVENTS_SERVICE_REPORT_URL, { user_id: request.params.id, payload, operation: 'UPDATE' });
        reply.code(201).send(updatedUser);
      } catch(err) {
        throw new Error(err);
      }
    })
}
export default routes;
