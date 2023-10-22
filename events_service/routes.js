import eventSchema from './schema.js'
async function routes(app) {
  const client = app.db.client;
  app
    .get('/events', { schema: eventSchema }, async (request, reply) => {
      try {
          const query = {
            text: 'SELECT * FROM events',
            values: []
          }
          if (request.query.user_id) {
            query.text = `${query.text} WHERE user_id = $$$`;
            query.values.push(request.query.user_id);
          }
          const page = parseInt(request.query.page, 10) || 1;
          const per_page = parseInt(request.query.per_page, 10) || 10;
          const offset = (page - 1) * per_page;

          query.text = `${query.text} LIMIT $$$ OFFSET $$$`;
          query.values.push(per_page);
          query.values.push(offset);

          const replacements = query.text.match(/\$\$\$/g).length;
          for(let i = 0; i < replacements; i++) {
            query.text = query.text.replace('$$$', `$${i+1}`);
          }
          const {rows} = await client.query(query);
          reply.send(rows);
      } catch(err) {
          throw new Error(err)
      }
    })
    .post('/events', { schema: eventSchema }, async (request, reply) => {
      const { user_id, operation, payload } = request.body;
      const query = {
        text: `INSERT INTO events (user_id, operation, payload) VALUES($1, $2, $3)`,
        values: [user_id, operation, payload],
      }
      try {
        await client.query(query);
        reply.code(201);
      } catch(err) {
        throw new Error(err);
      }
    })
}
export default routes;
