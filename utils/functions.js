;
const {keccak256} = require("js-sha3");
const UUIDv4 = require('uuid').v4;
const {ValidationError: sequelizeError} = require("sequelize");
const fs = require('fs');
const {HASH_PREFIX, NULL_HASH, EMPTY_STRING, variableTypes} = require("./constants.js");


function getHash(string) {
    return `${HASH_PREFIX}${keccak256(string)}`;
}

function getUUID() {
    return UUIDv4();
}

function cloneElement(element) {
    return JSON.parse(JSON.stringify(element));
}

function JSONParseIgnoreError(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (ignored) {
        return jsonString;
    }
}

function processRegardlessIfArray(data, processFunction, ...extraArgs) {
    if (isNullAny(data)) {
        return data;
    }

    const isArray = Array.isArray(data);
    if (!isArray) {
        data = [data];
    }

    data = data.map(e => processFunction(e, extraArgs));

    if (!isArray) {
        return data[0];
    }

    return data;
}

function filterObjectOrArrayObjsProps(objOrArrayObj, keys, shouldClone = true) {
    if (shouldClone) {
        objOrArrayObj = cloneElement(objOrArrayObj);
    }

    if (!Array.isArray(keys)) {
        keys = [keys];
    }

    keys.forEach((key) => objOrArrayObj = processRegardlessIfArray(objOrArrayObj, processFunction, key));

    return objOrArrayObj;


    function processFunction(obj, extraArgs) {
        const key = extraArgs[0];

        if (!isNullAny(obj) && typeof obj === variableTypes.OBJECT) {
            for (const prop in obj) {
                if (!obj.hasOwnProperty(prop)) continue;
                if (prop === key) {
                    delete obj[key];
                } else if (typeof obj[prop] === variableTypes.OBJECT) {
                    filterObjectOrArrayObjsProps(obj[prop], key, false);
                }
            }
        }

        return obj;
    }
}

function filterObjectNullProperties(obj) {
    Object.keys(obj).forEach((key) => isNullAny(obj[key]) && delete obj[key]);
    return obj;
}

function isNullAny(...args) {
    for (let i = 0; i < args.length; i++) {
        let current = args[i];
        if (current && current.constructor === Object) {
            try {
                current = JSON.parse(JSON.stringify(args[i]));
            } catch (ignored) {
            }
        }

        if (
            current == null || // element == null covers element === undefined
            (current.hasOwnProperty("length") && current.length === 0) || // has length and it's zero
            (current.constructor === Object && Object.keys(current).length === 0) || // is an Object and has no keys
            current.toString().toLowerCase() === variableTypes.NULL ||
            current.toString().toLowerCase() === variableTypes.UNDEFINED ||
            current.toString().trim() === EMPTY_STRING
        ) {
            return true;
        }

        if (typeof current !== variableTypes.NUMBER) {
            try {
                if (+new Date(current) === 0) {
                    // is not a number and can be parsed as null date 1970
                    return true;
                }
            } catch (ignored) {
            }
        }

        const parsed = JSONParseIgnoreError(current);
        if (parsed !== current && isNullAny(parsed)) {
            // recursive check for stringified object
            return true;
        }

        // check for hashes of null values
        if (
            [
                "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470", // null/undefined/""/[].toString(),
                "0x7bc087f4ef9d0dc15fef823bff9c78cc5cca8be0a85234afcfd807f412f40877", // {}.toString()
                "0x518674ab2b227e5f11e9084f615d57663cde47bce1ba168b4c19c7ee22a73d70", // JSON.stringify([])
                "0xb48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d", // JSON.stringify({})
                "0xefbde2c3aee204a69b7696d4b10ff31137fe78e3946306284f806e2dfc68b805", // "null"
                "0x019726c6babc1de231f26fd6cbb2df2c912784a2e1ba55295496269a6d3ff651", // "undefined"
                "0x681afa780d17da29203322b473d3f210a7d621259a4e6ce9e403f5a266ff719a", // " "
                "0xfc6664300e2ce056cb146b05edef3501ff8bd027c49a8dde866901679a24fb7e", // new Date(0).toString()
                NULL_HASH,
            ].includes(current)
        ) {
            return true;
        }
    }

    return false;
}

function areNotNullAll(...args) {
    return args.some((arg) => !isNullAny(arg));
}

function areNullAll(...args) {
    return !areNotNullAll(...args);
}

function getUnixTimeInSeconds() {
    return Math.floor(Date.now() / 1000);
}

function processSequelizeValidationError(error) {
    if (error instanceof sequelizeError && !isNullAny(error.errors)) {
        const errors = error.errors;

        const arr = [];
        for (let i = 0; i < errors.length; i++) {
            let currentError = errors[i];

            arr.push({
                field: currentError.path,
                message: currentError.message
            });
        }

        if (arr.length === 1) {
            return arr[0];
        }

        return arr;
    }

    return error;
}

function readFile(path) {
    return fs.readFileSync(path, {encoding: 'base64'});
}

function writeFile(data, path) {
    return fs.writeFileSync(path, data, {encoding: 'base64'});
}


module.exports = {
    getHash,
    getUUID,
    cloneElement,
    JSONParseIgnoreError,
    processRegardlessIfArray,
    filterObjectOrArrayObjsProps,
    filterObjectNullProperties,
    isNullAny,
    areNotNullAll,
    areNullAll,
    getUnixTimeInSeconds,
    processSequelizeValidationError,
    readFile,
    writeFile,
};
