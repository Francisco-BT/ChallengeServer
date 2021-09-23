const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const { routesV1 } = require('./routes');
const { errorHandler } = require('./middlewares');
const { NODE_ENV } = require('./config');

const app = express();
app.use(express.json());
NODE_ENV !== 'test' && app.use(morgan('dev'));

app.get('/', (req, res) => res.send({ message: 'Welcome!' }));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(require('./docs')));
app.use(routesV1.path, routesV1.router);

app.use(errorHandler);
module.exports = app;