'use strict';

const path = require('path');
process.chdir(__dirname);

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  await app.start();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
