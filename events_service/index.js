import { app, start } from './server.js';
import routes from './routes.js';
import dbConnector from './dbConnector.js';

app.register(dbConnector);
app.register(routes);
start();
