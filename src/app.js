const express = require('express');
const { User } = require('./models');
const { routesV1 } = require('./routes');

const app = express();
app.use(express.json());

app.use(routesV1.path, routesV1.router);

app.post('/api/v1/users', async (req, res) => {
  await User.create({ ...req.body });
  res.send({ message: 'User created' });
});

module.exports = app;
