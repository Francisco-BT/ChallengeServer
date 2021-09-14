module.exports = {
  ...require('./user-validators'),
  ...require('./custom-validators'),
  validate: require('./validate'),
};
