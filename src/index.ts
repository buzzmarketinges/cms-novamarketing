import type { Core } from '@strapi/strapi';

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

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Middleware Koa: intercepta TODOS los errores HTTP (admin + API)
    strapi.server.use(async (ctx: any, next: any) => {
      try {
        await next();
      } catch (err: any) {
        const msg = err?.message || String(err);
        const code = err?.code || err?.errno || '';
        strapi.log.error(`[HTTP-ERROR] ${ctx.method} ${ctx.url} → ${msg} (code=${code})`);
        if (err?.stack) strapi.log.error('[HTTP-ERROR] stack: ' + err.stack);

        // Devuelve el mensaje real al admin en lugar de "Internal Server Error"
        ctx.status = err?.status || err?.statusCode || 500;
        ctx.body = {
          data: null,
          error: {
            status: ctx.status,
            name: err?.name || 'InternalError',
            message: msg + (code ? ` [${code}]` : ''),
            details: err?.details || {},
          },
        };
      }
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Forzar layout del admin para artículos (excerpt + metadescription visibles)
    // Strapi v5: store usa type:'plugin', name:'content_manager' y clave 'configuration_api::article.article'
    try {
      const CM_STORE = strapi.store({ type: 'plugin', name: 'content_manager' } as any);
      const CM_KEY = 'configuration_api::article.article';
      await CM_STORE.set({ key: CM_KEY, value: ARTICLE_LAYOUT });
      strapi.log.info('[bootstrap] Article admin layout applied');
    } catch (err: any) {
      strapi.log.warn('[bootstrap] Could not update article layout: ' + err?.message);
    }

    process.on('unhandledRejection', (reason: any) => {
      strapi.log.error('[UNHANDLED] ' + (reason?.message || String(reason)));
      strapi.log.error('[UNHANDLED] stack: ' + (reason?.stack || ''));
    });

    // Sincronizar excerpt con metadescription automáticamente
    (strapi.db as any).lifecycles.subscribe({
      models: ['api::article.article'],
      async beforeCreate(event: any) {
        if (event.params?.data?.metadescription) {
          event.params.data.excerpt = event.params.data.metadescription;
        }
      },
      async beforeUpdate(event: any) {
        if (event.params?.data?.metadescription) {
          event.params.data.excerpt = event.params.data.metadescription;
        }
      },
    });

    (strapi.db as any).lifecycles.subscribe({
      models: ['api::case-study.case-study'],
      async beforeCreate(event: any) {
        strapi.log.info('[CS:beforeCreate] locale=' + event.params?.data?.locale + ' slug=' + event.params?.data?.slug);
      },
      async afterCreate(event: any) {
        strapi.log.info('[CS:afterCreate] id=' + event.result?.id);
      },
      async beforeUpdate(event: any) {
        strapi.log.info('[CS:beforeUpdate] where=' + JSON.stringify(event.params?.where));
      },
      async afterUpdate(event: any) {
        strapi.log.info('[CS:afterUpdate] id=' + event.result?.id);
      },
    });
  },
};
