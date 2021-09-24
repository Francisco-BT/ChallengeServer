module.exports = {
  Role: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/Id',
      },
      name: {
        type: 'string',
        description: 'The role in a human representation',
      },
      description: {
        type: 'string',
        description: 'A small description of the privileges of the role',
      },
    },
  },
};
