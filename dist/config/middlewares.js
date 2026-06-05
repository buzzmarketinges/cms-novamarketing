"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = [
    'strapi::logger',
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'https:'],
                    'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com', 'market-assets.strapi.io'],
                    'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com', 'market-assets.strapi.io'],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    {
        name: 'strapi::body',
        config: {
            formLimit: '256mb',
            jsonLimit: '256mb',
            textLimit: '256mb',
            formidable: {
                maxFileSize: 256 * 1024 * 1024, // 256mb
                keepExtensions: true,
            },
        },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
exports.default = config;
