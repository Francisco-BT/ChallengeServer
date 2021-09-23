module.exports = {
  TeamInput: {
    type: 'object',
    properties: {
      accountId: {
        $ref: '#/components/schemas/Id',
      },
      members: {
        type: 'array',
        items: {
          type: 'integer',
          minimum: 1,
        },
        minItems: 1,
        maxItems: 10,
        uniqueItems: true,
      },
    },
  },
  TeamMovement: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
      },
      accountId: {
        type: 'integer',
      },
      userName: {
        type: 'string',
      },
      userEmail: {
        type: 'string',
        format: 'email',
      },
      accountName: {
        type: 'string',
      },
      operation: {
        type: 'string',
        enum: ['Create', 'Update', 'Delete'],
      },
      startDate: {
        type: 'string',
        format: 'date',
      },
      endDate: {
        type: 'string',
        format: 'date',
      },
    },
  },
};
