module.exports = {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ...require('./users/schema'),
      ...require('./roles/schema'),
      ...require('./accounts/schema'),
      ...require('./teams/schema'),
      Id: {
        type: 'integer',
        description: 'The unique identifier of the entry',
        example: 1,
      },
      IdParam: {
        name: 'id',
        in: 'query',
        schema: {
          $ref: '#/components/schemas/Id',
        },
        required: true,
      },
      PaginationPage: {
        type: 'integer',
        minimum: 1,
        description: 'The page to request',
      },
      PaginationLimit: {
        type: 'integer',
        minimum: 10,
        description:
          'The number of items to get per page, this can be varied depending on the endpoint configuration',
      },
      Pagination: {
        type: 'object',
        properties: {
          totalPages: {
            type: 'integer',
            description: 'The available number of pages',
          },
          limit: {
            type: 'integer',
            description: 'The current number of items to return per page',
          },
          hasNext: {
            type: 'boolean',
            description:
              'A flag to indicate if there is a next available page from the current page',
          },
          hasPrevious: {
            type: 'boolean',
            description:
              'A flag to indicate if there is a previous available page from the current page',
          },
          currentPage: {
            type: 'integer',
            description: 'The current page used to get the list of items',
          },
          total: {
            type: 'integer',
            description: 'The total number of items stored',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'A small description of the error',
            example: 'Bad Request',
          },
          timestamp: {
            type: 'number',
            description:
              'A unix timestamp representation of when the error happens',
            example: new Date().getTime(),
          },
          errors: {
            type: 'object',
            nullable: true,
            description:
              'description: An object with the fields that not are valid',
            example: {
              name: 'Name cannot be null',
              email: 'Email has an invalid format',
            },
          },
        },
      },
    },
  },
};
