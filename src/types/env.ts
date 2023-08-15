const EnvTypesArr = ["development", "production", "test"] as const;

type EnvType = (typeof EnvTypesArr)[number];

export { EnvTypesArr };
export type { EnvType };
