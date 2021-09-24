const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { routesV1 } = require('./routes');
const { errorHandler } = require('./middlewares');
const { NODE_ENV } = require('./config');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.static(path.resolve(__dirname + '../../../client/build')));
app.use(express.json());
NODE_ENV !== 'test' && app.use(morgan('dev'));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(require('./docs')));
app.use(routesV1.path, routesV1.router);
app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname + '../../../client/build/', 'index.html')
  );
});

app.use(errorHandler);
module.exports = app;
