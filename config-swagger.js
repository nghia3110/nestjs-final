"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
const swaggerConfig = (app) => {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('New base NestJS API')
        .setDescription('This is the new base API documentation!')
        .setVersion('1.0')
        .addTag('users')
        .addTag('upload')
        .addBearerAuth()
        .addSecurity('basic', {
        type: 'http',
        scheme: 'basic',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
};
exports.swaggerConfig = swaggerConfig;
//# sourceMappingURL=config-swagger.js.map