// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hotel Booking API',
            version: '1.0.0',
            description: 'API documentation for the Hotel Booking system',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],

        servers: [
            {
                url: 'https://hotel-booking-backend-nr66.onrender.com',
            },
        ],
    },
    apis: ['./routes/*.js'],
};
// < !--ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
