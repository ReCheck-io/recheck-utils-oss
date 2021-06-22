;
const HASH_PREFIX = "0x";
const NULL_HASH = `${HASH_PREFIX}${"0".repeat(64)}`;
const ERROR_STRING = "error";
const SUCCESS_STRING = "success";
const EMPTY_STRING = "";
const NEW_LINE = "\n";
const HASH_REGEX = new RegExp(`${HASH_PREFIX}[0-9a-f]{64}`);

const variableTypes = {
    NULL: "null",
    UNDEFINED: "undefined",
    OBJECT: "object",
    BOOLEAN: "boolean",
    NUMBER: "number",
    BIGINT: "bigint",
    STRING: "string",
    SYMBOL: "symbol",
    FUNCTION: "function",
};


module.exports = {
    HASH_PREFIX,
    NULL_HASH,
    ERROR_STRING,
    SUCCESS_STRING,
    EMPTY_STRING,
    NEW_LINE,
    HASH_REGEX,
    variableTypes,
};
