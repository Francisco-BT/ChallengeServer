const AccountCommonFields = {
  name: {
    type: 'string',
    description: 'Account name',
  },
  clientName: {
    type: 'string',
    description: "The account's client",
  },
  responsibleName: {
    type: 'string',
    description: 'The person who is in charge of the account',
  },
};

module.exports = {
  Account: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/Id',
      },
      ...AccountCommonFields,
    },
  },
  AccountInput: {
    type: 'object',
    properties: {
      ...AccountCommonFields,
    },
  },
};
