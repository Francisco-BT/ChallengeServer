module.exports = {
  ...require('./user-validators'),
  ...require('./custom-validators'),
  validate: require('./validate'),
  errorHandler: require('./error-handler'),
  tokenAuthorization: require('./token-authorization'),
};
