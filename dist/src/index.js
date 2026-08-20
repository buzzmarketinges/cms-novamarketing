"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    register({ strapi }) {
        // Middleware Koa: intercepta TODOS los errores HTTP (admin + API)
        strapi.server.use(async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                const msg = (err === null || err === void 0 ? void 0 : err.message) || String(err);
                const code = (err === null || err === void 0 ? void 0 : err.code) || (err === null || err === void 0 ? void 0 : err.errno) || '';
                strapi.log.error(`[HTTP-ERROR] ${ctx.method} ${ctx.url} → ${msg} (code=${code})`);
                if (err === null || err === void 0 ? void 0 : err.stack)
                    strapi.log.error('[HTTP-ERROR] stack: ' + err.stack);
                ctx.status = (err === null || err === void 0 ? void 0 : err.status) || (err === null || err === void 0 ? void 0 : err.statusCode) || 500;
                ctx.body = {
                    data: null,
                    error: {
                        status: ctx.status,
                        name: (err === null || err === void 0 ? void 0 : err.name) || 'InternalError',
                        message: msg + (code ? ` [${code}]` : ''),
                        details: (err === null || err === void 0 ? void 0 : err.details) || {},
                    },
                };
            }
        });
    },
    async bootstrap({ strapi }) {
        process.on('unhandledRejection', (reason) => {
            strapi.log.error('[UNHANDLED] ' + ((reason === null || reason === void 0 ? void 0 : reason.message) || String(reason)));
            strapi.log.error('[UNHANDLED] stack: ' + ((reason === null || reason === void 0 ? void 0 : reason.stack) || ''));
        });
        // Seed de sectores (idempotente): crea los 12 sectores verticales si la
        // colección está vacía. Slugs = keys de src/lib/sectors.ts del frontend.
        try {
            const SEED_SECTORS = [
                { name: 'Ecommerce', slug: 'ecommerce' },
                { name: 'Inmobiliarias', slug: 'inmobiliarias' },
                { name: 'Restaurantes', slug: 'restaurantes' },
                { name: 'Psicólogos', slug: 'psicologos' },
                { name: 'Terapeutas', slug: 'terapeutas' },
                { name: 'Dentistas', slug: 'dentistas' },
                { name: 'Gimnasios', slug: 'gimnasios' },
                { name: 'Constructoras', slug: 'constructoras' },
                { name: 'Abogados', slug: 'abogados' },
                { name: 'Industrial', slug: 'industrial' },
                { name: 'Hoteles', slug: 'hoteles' },
                { name: 'B2B', slug: 'b2b' },
            ];
            const sectorCount = await strapi.documents('api::sector.sector').count({});
            if (sectorCount === 0) {
                for (const s of SEED_SECTORS) {
                    await strapi.documents('api::sector.sector').create({ data: s });
                }
                strapi.log.info('[bootstrap] Seeded ' + SEED_SECTORS.length + ' sectors');
            }
        }
        catch (err) {
            strapi.log.warn('[bootstrap] Sector seed skipped: ' + (err === null || err === void 0 ? void 0 : err.message));
        }
        strapi.db.lifecycles.subscribe({
            models: ['api::case-study.case-study'],
            async beforeCreate(event) {
                strapi.log.info('[CS:beforeCreate] locale=' + event.params?.data?.locale + ' slug=' + event.params?.data?.slug);
            },
            async afterCreate(event) {
                strapi.log.info('[CS:afterCreate] id=' + event.result?.id);
            },
            async beforeUpdate(event) {
                strapi.log.info('[CS:beforeUpdate] where=' + JSON.stringify(event.params?.where));
            },
            async afterUpdate(event) {
                strapi.log.info('[CS:afterUpdate] id=' + event.result?.id);
            },
        });
    },
};
