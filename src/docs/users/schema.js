const UserEditableProperties = {
  name: {
    type: 'string',
  },
  englishLevel: {
    $ref: '#/components/schemas/EnglishLevel',
  },
  technicalKnowledge: {
    type: 'string',
  },
  cvLink: {
    type: 'string',
    format: 'hostname',
  },
};

module.exports = {
  EnglishLevel: {
    type: 'string',
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  },
  Credentials: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'password' },
    },
  },
  User: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/Id',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      ...UserEditableProperties,
      role: {
        type: 'string',
        description: 'The role of the user',
        nullable: true,
      },
    },
  },
  NewUserInput: {
    type: 'object',
    required: ['email', 'name', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
        format: 'password',
      },
      ...UserEditableProperties,
      roleId: {
        type: 'integer',
        minimum: 2,
        description: 'The role that will be assigned the user',
      },
    },
  },
  UpdateUserInput: {
    type: 'object',
    properties: {
      ...UserEditableProperties,
    },
  },
};
