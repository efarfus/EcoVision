import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'API', version: '1.0.0' },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string'},
            email: { type: 'string'},
            password: { type: 'string'},
            name: { type: 'string'},
            createdAt: { type: 'string', format: 'date-time'},
            updatedAt: { type: 'string', format: 'date-time', nullable: true}, 
          },
        },
        UserListResponse:{
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items:{
                $ref: '#/components/schemas/User'
              }
            }
          },
        },
        FavoriteListResponse:{
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items:{
                $ref: '#/components/schemas/Coordinate'
              }
            }
          },
        },
        Coordinate:{
          type: 'object',
          properties:{
            id: { type: 'string' },
            userId: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      },
    },
  },
  apis: ['src/routes/docs/**/*.ts'],
};


export const swaggerSpec = swaggerJSDoc(options);
