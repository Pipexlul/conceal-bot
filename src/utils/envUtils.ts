import envConfig from "../config/env";

const isDev = envConfig.node_env === "development";
const isTest = envConfig.node_env === "test";
const isProd = envConfig.node_env === "production";

const getServerIds = () => {
  const result: string[] = [envConfig.testServerId];
  if (isProd) {
    result.push(envConfig.realServerId);
  }

  return result;
};

export { isDev, isTest, isProd, getServerIds };
