/** @type {import("lint-staged").Config} */
const config = {
  "*.{ts,js,mjs,cjs,json}": ["biome check --apply --no-errors-on-unmatched"],
};

export default config;
