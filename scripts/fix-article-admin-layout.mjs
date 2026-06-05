/**
 * fix-article-admin-layout.mjs
 * Añade metadescription y excerpt al layout de edición del panel admin de Strapi
 * Ejecutar: node backend/scripts/fix-article-admin-layout.mjs
 */
import Database from 'better-sqlite3';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../.tmp/data.db');

const db = new Database(dbPath);

const config = {
  settings: {
    bulkable: true,
    filterable: true,
    searchable: true,
    pageSize: 10,
    relationOpenMode: 'modal',
    mainField: 'title',
    defaultSortBy: 'title',
    defaultSortOrder: 'ASC'
  },
  metadatas: {
    id: { edit: {}, list: { label: 'id', searchable: true, sortable: true } },
    title: {
      edit: { label: 'Título', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Título', searchable: true, sortable: true }
    },
    slug: {
      edit: { label: 'Slug', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'Slug', searchable: true, sortable: true }
    },
    excerpt: {
      edit: {
        label: 'Extracto (resumen visible en listados)',
        description: 'Texto breve que aparece en las tarjetas del blog',
        placeholder: 'Escribe un resumen de 1-2 frases...',
        visible: true,
        editable: true
      },
      list: { label: 'Extracto', searchable: false, sortable: false }
    },
    metadescription: {
      edit: {
        label: 'Meta Descripción SEO',
        description: 'Descripción que aparece en Google (150-160 caracteres recomendados)',
        placeholder: 'Escribe la meta descripción para Google...',
        visible: true,
        editable: true
      },
      list: { label: 'Meta Descripción', searchable: false, sortable: false }
    },
    content: {
      edit: { label: 'content', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'content', searchable: false, sortable: false }
    },
    cover_image: {
      edit: { label: 'Imagen de portada', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'cover_image', searchable: false, sortable: false }
    },
    author: {
      edit: { label: 'Autor', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'author', searchable: true, sortable: true }
    },
    categories: {
      edit: { label: 'Categorías', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'categories', searchable: false, sortable: false }
    },
    page_blocks: {
      edit: { label: 'Contenido (bloques)', description: '', placeholder: '', visible: true, editable: true },
      list: { label: 'page_blocks', searchable: false, sortable: false }
    },
    createdAt: {
      edit: { label: 'createdAt', description: '', placeholder: '', visible: false, editable: true },
      list: { label: 'createdAt', searchable: true, sortable: true }
    },
    updatedAt: {
      edit: { label: 'updatedAt', description: '', placeholder: '', visible: false, editable: true },
      list: { label: 'updatedAt', searchable: true, sortable: true }
    },
    createdBy: {
      edit: { label: 'createdBy', description: '', placeholder: '', visible: false, editable: true, mainField: 'firstname' },
      list: { label: 'createdBy', searchable: true, sortable: true }
    },
    updatedBy: {
      edit: { label: 'updatedBy', description: '', placeholder: '', visible: false, editable: true, mainField: 'firstname' },
      list: { label: 'updatedBy', searchable: true, sortable: true }
    },
    documentId: { edit: {}, list: { label: 'documentId', searchable: true, sortable: true } }
  },
  layouts: {
    list: ['id', 'title', 'slug', 'cover_image'],
    edit: [
      [{ name: 'title', size: 6 }, { name: 'slug', size: 6 }],
      [{ name: 'excerpt', size: 12 }],
      [{ name: 'metadescription', size: 12 }],
      [{ name: 'cover_image', size: 6 }, { name: 'author', size: 6 }],
      [{ name: 'categories', size: 12 }],
      [{ name: 'page_blocks', size: 12 }]
    ]
  },
  uid: 'api::article.article'
};

const key = 'plugin_content_manager_configuration_content_types::api::article.article';
const exists = db.prepare('SELECT key FROM strapi_core_store_settings WHERE key = ?').get(key);

if (exists) {
  db.prepare('UPDATE strapi_core_store_settings SET value = ? WHERE key = ?').run(JSON.stringify(config), key);
  console.log('✓ Layout actualizado correctamente');
} else {
  db.prepare('INSERT INTO strapi_core_store_settings (key, value, type, environment, tag) VALUES (?, ?, ?, ?, ?)').run(key, JSON.stringify(config), 'object', '', '');
  console.log('✓ Layout insertado correctamente');
}

db.close();
