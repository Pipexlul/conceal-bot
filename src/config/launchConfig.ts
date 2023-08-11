import { launchArgsChecker } from "../utils/argUtils";

const argCheck = launchArgsChecker();

const launchArgs: Record<string, boolean> = {
  dev: argCheck("dev"),
};
