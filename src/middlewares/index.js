module.exports = {
  ...require('./user-validators'),
  ...require('./custom-validators'),
  validate: require('./validate'),
  errorHandler: require('./error-handler'),
  roleAuthorization: require('./role-authorization'),
  tokenAuthorization: require('./token-authorization'),
};
