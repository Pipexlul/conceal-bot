import axios from "axios";

import envConfig from "../../config/env";
const {
  apiKeys: { inworld },
} = envConfig;

const inWorldAxios = axios.create({
  baseURL: "https://api.inworld.ai/studio/v1",
  headers: {
    Authorization: `Basic ${inworld.studio}`,
    "Grpc-Metadata-X-Authorization-Bearer-Type": "studio_api",
  },
});

export { inWorldAxios };
