import { z } from "zod";

const nonEmptyString = z.string().nonempty();
const oneCharString = z.string().length(1);

const argArray: string[] = process.argv.slice(2);
const LONG_PREFIX = "--";
const SHORT_PREFIX = "-";

const launchArgsChecker = (fullForm: string, shortForm?: string) => {
  const finalStrings: string[] = [];

  const isFullOneChar = oneCharString.safeParse(fullForm).success;
  const isShortOneChar =
    !!shortForm && oneCharString.safeParse(shortForm).success;

  if (!shortForm && isFullOneChar) {
    finalStrings.push(SHORT_PREFIX + fullForm);
  } else {
    if (nonEmptyString.safeParse(shortForm).success) {
      if (isFullOneChar) {
      }

      finalStrings.push(SHORT_PREFIX + shortForm);
    }

    if (nonEmptyString.safeParse(fullForm).success) {
      finalStrings.push(LONG_PREFIX + fullForm);
    }
  }
};

export { launchArgsChecker };
