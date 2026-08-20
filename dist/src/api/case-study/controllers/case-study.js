"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::case-study.case-study', ({ strapi }) => ({
    async create(ctx) {
        try {
            return await super.create(ctx);
        }
        catch (err) {
            strapi.log.error('[CaseStudy:create] ' + (err === null || err === void 0 ? void 0 : err.message));
            strapi.log.error('[CaseStudy:create] code=' + (err === null || err === void 0 ? void 0 : err.code) + ' errno=' + (err === null || err === void 0 ? void 0 : err.errno));
            strapi.log.error('[CaseStudy:create] details=' + JSON.stringify((err === null || err === void 0 ? void 0 : err.details) || {}));
            strapi.log.error('[CaseStudy:create] stack=' + (err === null || err === void 0 ? void 0 : err.stack));
            throw err;
        }
    },
    async update(ctx) {
        try {
            return await super.update(ctx);
        }
        catch (err) {
            strapi.log.error('[CaseStudy:update] ' + (err === null || err === void 0 ? void 0 : err.message));
            strapi.log.error('[CaseStudy:update] code=' + (err === null || err === void 0 ? void 0 : err.code) + ' errno=' + (err === null || err === void 0 ? void 0 : err.errno));
            strapi.log.error('[CaseStudy:update] details=' + JSON.stringify((err === null || err === void 0 ? void 0 : err.details) || {}));
            strapi.log.error('[CaseStudy:update] stack=' + (err === null || err === void 0 ? void 0 : err.stack));
            throw err;
        }
    },
}));
