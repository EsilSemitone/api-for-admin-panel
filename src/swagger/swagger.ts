import swaggerAutogen from 'swagger-autogen';
import { usersSchemas } from './schemas/users.schemas';
import { commonSchemas } from './schemas/common.schemas';
import { adminSchemas } from './schemas/admin.schemas';
import { productSchemas } from './schemas/product.schema';

const doc = {
    info: {
        title: 'Todo API',
        description: 'My todo API',
    },
    host: 'localhost:8000',
    components: {
        schemas: {
            ...usersSchemas,
            ...commonSchemas,
            ...adminSchemas,
            ...productSchemas,
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
};

const outputFile = './swagger-output.json';
const routes = [
    '../users/users.controller.ts',
    '../admin/admin.controller.ts',
    '../products/products.controller.ts',
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);

// swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc).then(async () => {
//     const main = await box;
// });
