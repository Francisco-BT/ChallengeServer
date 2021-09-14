exports.notEmptyWithMessage = (validationChain, message) =>
  validationChain.notEmpty().withMessage(message).bail();
