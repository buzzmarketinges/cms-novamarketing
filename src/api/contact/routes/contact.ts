export default {
  routes: [
    {
      method: 'POST',
      path: '/contact',
      handler: 'api::contact.contact.send',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/contact/test',
      handler: 'api::contact.contact.test',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
