/**
 * Convierte un texto en slug limpio:
 * sin acentos, sin ñ/ç, todo minúsculas, solo a-z 0-9 y guiones.
 */
function toSlug(raw: string): string {
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
export default {
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Generar slug desde título si no se proporcionó
    if (!data.slug && data.title) {
      data.slug = toSlug(data.title);
    } else if (data.slug) {
      data.slug = toSlug(data.slug);
    }

    // Autor por defecto
    if (!data.author) {
      const authors = await (strapi.documents as any)('api::author.author').findMany({
        filters: { name: { $containsi: 'Sergio' } },
        limit: 1,
      });
      const list = Array.isArray(authors) ? authors : [];
      if (list.length > 0) {
        data.author = list[0].documentId ?? list[0].id;
      }
    }
  },

  async beforeUpdate(event: any) {
    const { data } = event.params;

    // Generar slug desde título si se borró
    if (!data.slug && data.title) {
      data.slug = toSlug(data.title);
    } else if (data.slug) {
      data.slug = toSlug(data.slug);
    }
  },
};
