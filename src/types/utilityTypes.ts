/**
 * Represents a pair of strings that can be used to check for a flag in command line arguments.
 *
 * @typedef {Array<string?, string?>} ArgCheck
 * @property {string?} 0 - The long form of the flag.
 * @property {string?} 1 - The short form of the flag.
 */
export type ArgCheck = [string?, string?];
