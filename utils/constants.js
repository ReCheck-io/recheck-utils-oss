;
const HASH_PREFIX = "0x";
const NULL_HASH = `${HASH_PREFIX}${"0".repeat(64)}`;
const ERROR_STRING = "error";
const SUCCESS_STRING = "success";
const EMPTY_STRING = "";
const NEW_LINE = "\n";
const URL_SLASH = "/";
const WINDOWS_SLASH = "\\";
const LINUX_SLASH = URL_SLASH;
const URL_ANY_PATH = `${URL_SLASH}*`;
const HASH_REGEX = new RegExp(`${HASH_PREFIX}[0-9a-f]{64}`);
const UUID_REGEX = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
const SEQUELIZE_ERROR = require("sequelize").ValidationError;

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
    URL_SLASH,
    WINDOWS_SLASH,
    LINUX_SLASH,
    URL_ANY_PATH,
    HASH_REGEX,
    UUID_REGEX,
    SEQUELIZE_ERROR,
    variableTypes,
};
