module.exports = {
  ...require('./EncryptException'),
  APIException: require('./APIException'),
  ValidationsException: require('./ValidationsException'),
  AuthenticationException: require('./AuthenticationException'),
  BadRequestException: require('./BadRequestException'),
  ForbiddenException: require('./ForbiddenException'),
  TokenGenerationException: require('./TokenGenerationException'),
  ConflictException: require('./ConflictException'),
};
