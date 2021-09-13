const express = require('express');
const { routesV1 } = require('./routes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send({ message: 'Welcome!' }));
app.use(routesV1.path, routesV1.router);

module.exports = app;
