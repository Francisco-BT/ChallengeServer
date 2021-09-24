module.exports = {
  paths: {
    ...require('./users/paths'),
    ...require('./roles/paths'),
    ...require('./accounts/paths'),
    ...require('./teams/paths'),
  },
};
