"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ARTICLE_LAYOUT = {
    settings: { bulkable: true, filterable: true, searchable: true, pageSize: 10, mainField: 'title', defaultSortBy: 'title', defaultSortOrder: 'ASC' },
    metadatas: {
        id: { edit: {}, list: { label: 'id', searchable: true, sortable: true } },
        title: { edit: { label: 'Título', description: '', placeholder: '', visible: true, editable: true }, list: { label: 'Título', searchable: true, sortable: true } },
        slug: { edit: { label: 'Slug', description: '', placeholder: '', visible: true, editable: true }, list: { label: 'Slug', searchable: true, sortable: true } },
        excerpt: { edit: { label: 'Extracto', description: '', placeholder: '', visible: false, editable: true }, list: { label: 'Extracto', searchable: false, sortable: false } },
        metadescription: { edit: { label: 'Meta Descripción SEO', description: 'Descripción para Google (150-160 caracteres)', placeholder: 'Escribe la meta descripción...', visible: true, editable: true }, list: { label: 'Meta Descripción', searchable: false, sortable: false } },
        cover_image: { edit: { label: 'Imagen de portada', description: '', placeholder: '', visible: true, editable: true }, list: { label: 'cover_image', searchable: false, sortable: false } },
        author: { edit: { label: 'Autor', description: '', placeholder: '', visible: true, editable: true }, list: { label: 'author', searchable: true, sortable: true } },
        categories: { edit: { label: 'Categorías', description: '', placeholder: '', visible: true, editable: true }, list: { label: 'categories', searchable: false, sortable: false } },
        page_blocks: { edit: { label: 'Contenido (bloques)', description: '', placeholder: '', visible: true, editable: true }, list: { label: 'page_blocks', searchable: false, sortable: false } },
        createdAt: { edit: { label: 'createdAt', visible: false, editable: true }, list: { label: 'createdAt', searchable: true, sortable: true } },
        updatedAt: { edit: { label: 'updatedAt', visible: false, editable: true }, list: { label: 'updatedAt', searchable: true, sortable: true } },
        createdBy: { edit: { label: 'createdBy', visible: false, editable: true, mainField: 'firstname' }, list: { label: 'createdBy', searchable: true, sortable: true } },
        updatedBy: { edit: { label: 'updatedBy', visible: false, editable: true, mainField: 'firstname' }, list: { label: 'updatedBy', searchable: true, sortable: true } },
        documentId: { edit: {}, list: { label: 'documentId', searchable: true, sortable: true } },
    },
    layouts: {
        list: ['id', 'title', 'slug', 'cover_image'],
        edit: [
            [{ name: 'title', size: 6 }, { name: 'slug', size: 6 }],
            [{ name: 'metadescription', size: 12 }],
            [{ name: 'cover_image', size: 6 }, { name: 'author', size: 6 }],
            [{ name: 'categories', size: 12 }],
            [{ name: 'page_blocks', size: 12 }],
        ],
    },
    uid: 'api::article.article',
};
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
                // Devuelve el mensaje real al admin en lugar de "Internal Server Error"
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
        // Forzar layout del admin para artículos (excerpt + metadescription visibles)
        // Strapi v5: store usa type:'plugin', name:'content_manager' y clave 'configuration_api::article.article'
        try {
            const CM_STORE = strapi.store({ type: 'plugin', name: 'content_manager' });
            const CM_KEY = 'configuration_api::article.article';
            await CM_STORE.set({ key: CM_KEY, value: ARTICLE_LAYOUT });
            strapi.log.info('[bootstrap] Article admin layout applied');
        }
        catch (err) {
            strapi.log.warn('[bootstrap] Could not update article layout: ' + (err === null || err === void 0 ? void 0 : err.message));
        }
        process.on('unhandledRejection', (reason) => {
            strapi.log.error('[UNHANDLED] ' + ((reason === null || reason === void 0 ? void 0 : reason.message) || String(reason)));
            strapi.log.error('[UNHANDLED] stack: ' + ((reason === null || reason === void 0 ? void 0 : reason.stack) || ''));
        });
        // Sincronizar excerpt con metadescription automáticamente
        strapi.db.lifecycles.subscribe({
            models: ['api::article.article'],
            async beforeCreate(event) {
                var _a, _b;
                if ((_b = (_a = event.params) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.metadescription) {
                    event.params.data.excerpt = event.params.data.metadescription;
                }
            },
            async beforeUpdate(event) {
                var _a, _b;
                if ((_b = (_a = event.params) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.metadescription) {
                    event.params.data.excerpt = event.params.data.metadescription;
                }
            },
        });
        strapi.db.lifecycles.subscribe({
            models: ['api::case-study.case-study'],
            async beforeCreate(event) {
                var _a, _b, _c, _d;
                strapi.log.info('[CS:beforeCreate] locale=' + ((_b = (_a = event.params) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.locale) + ' slug=' + ((_d = (_c = event.params) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.slug));
            },
            async afterCreate(event) {
                var _a;
                strapi.log.info('[CS:afterCreate] id=' + ((_a = event.result) === null || _a === void 0 ? void 0 : _a.id));
            },
            async beforeUpdate(event) {
                var _a;
                strapi.log.info('[CS:beforeUpdate] where=' + JSON.stringify((_a = event.params) === null || _a === void 0 ? void 0 : _a.where));
            },
            async afterUpdate(event) {
                var _a;
                strapi.log.info('[CS:afterUpdate] id=' + ((_a = event.result) === null || _a === void 0 ? void 0 : _a.id));
            },
        });
    },
};
