"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convierte un texto en slug limpio:
 * sin acentos, sin ñ/ç, todo minúsculas, solo a-z 0-9 y guiones.
 */
function toSlug(raw) {
    return raw
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[ñÑ]/g, 'n')
        .replace(/[çÇ]/g, 'c')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
/**
 * Lifecycle hooks para artículos:
 * - Auto-genera slug desde el título si está vacío
 * - Sanitiza siempre el slug (sin acentos, ñ, ç)
 * - Asigna Sergio García como autor por defecto
 */
exports.default = {
    async beforeCreate(event) {
        var _a;
        const { data } = event.params;
        // Generar slug desde título si no se proporcionó
        if (!data.slug && data.title) {
            data.slug = toSlug(data.title);
        }
        else if (data.slug) {
            data.slug = toSlug(data.slug);
        }
        // Autor por defecto
        if (!data.author) {
            const authors = await strapi.documents('api::author.author').findMany({
                filters: { name: { $containsi: 'Sergio' } },
                limit: 1,
            });
            const list = Array.isArray(authors) ? authors : [];
            if (list.length > 0) {
                data.author = (_a = list[0].documentId) !== null && _a !== void 0 ? _a : list[0].id;
            }
        }
    },
    async beforeUpdate(event) {
        const { data } = event.params;
        // Generar slug desde título si se borró
        if (!data.slug && data.title) {
            data.slug = toSlug(data.title);
        }
        else if (data.slug) {
            data.slug = toSlug(data.slug);
        }
    },
};
