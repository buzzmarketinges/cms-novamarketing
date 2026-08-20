"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/contact',
            handler: 'api::contact.contact.send',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
