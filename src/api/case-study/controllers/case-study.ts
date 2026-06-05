import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::case-study.case-study', ({ strapi }) => ({
  async create(ctx) {
    try {
      return await super.create(ctx);
    } catch (err: any) {
      strapi.log.error('[CaseStudy:create] ' + err?.message);
      strapi.log.error('[CaseStudy:create] code=' + err?.code + ' errno=' + err?.errno);
      strapi.log.error('[CaseStudy:create] details=' + JSON.stringify(err?.details ?? {}));
      strapi.log.error('[CaseStudy:create] stack=' + err?.stack);
      throw err;
    }
  },

  async update(ctx) {
    try {
      return await super.update(ctx);
    } catch (err: any) {
      strapi.log.error('[CaseStudy:update] ' + err?.message);
      strapi.log.error('[CaseStudy:update] code=' + err?.code + ' errno=' + err?.errno);
      strapi.log.error('[CaseStudy:update] details=' + JSON.stringify(err?.details ?? {}));
      strapi.log.error('[CaseStudy:update] stack=' + err?.stack);
      throw err;
    }
  },
}));
