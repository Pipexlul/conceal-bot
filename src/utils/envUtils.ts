import envConfig from "../config/env";

const isDev = envConfig.node_env === "development";
const isTest = envConfig.node_env === "test";
const isProd = envConfig.node_env === "production";

export { isDev, isTest, isProd };
