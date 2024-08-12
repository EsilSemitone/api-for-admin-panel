import { RequestHandler } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JsonObject, serve, setup } from 'swagger-ui-express';

type SwaggerMiddlewaresReturnType = RequestHandler[];

export function swaggerMiddlewares(): SwaggerMiddlewaresReturnType {
    const swaggerDoc: JsonObject = JSON.parse(
        readFileSync(join(__dirname, './swagger-output.json'), 'utf-8'),
    );
    return [...serve, setup(swaggerDoc)];
}
