const express = require('express');
const { routesV1 } = require('./routes');
const { errorHandler } = require('./middlewares');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send({ message: 'Welcome!' }));
app.use(routesV1.path, routesV1.router);

app.use(errorHandler);
module.exports = app;
