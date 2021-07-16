;
const {expect} = require("chai");
const fs = require("fs");
const {getValidationError, getBase64String} = require("./utils");
const {
    constants,
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
    isUndefinedAny,
    getUnixTimeInSeconds,
    renameObjKeysWithPrefixSuffix,
    processSequelizeValidationError,
    readFile,
    writeFile
} = require("../index.js");


describe("test ReCheck OSS utils functions", () => {

    it("should be able to require functions", (done) => {
        try {
            const {constants, ...functions} = require("../index.js");

            if (Object.values(functions).length <= 0) {
                throw new Error("Functions object is empty");
            }

            done();
        } catch (error) {
            console.log(error);
        }
    });

    it("should be able to get correct hash", () => {
        const nullHashes = {
            "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470": ["", [].toString()],
            "0x7bc087f4ef9d0dc15fef823bff9c78cc5cca8be0a85234afcfd807f412f40877": [{}.toString()],
            "0x518674ab2b227e5f11e9084f615d57663cde47bce1ba168b4c19c7ee22a73d70": [JSON.stringify([])],
            "0xb48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d": [JSON.stringify({})],
            "0xefbde2c3aee204a69b7696d4b10ff31137fe78e3946306284f806e2dfc68b805": ["null"],
            "0x019726c6babc1de231f26fd6cbb2df2c912784a2e1ba55295496269a6d3ff651": ["undefined"],
            "0x681afa780d17da29203322b473d3f210a7d621259a4e6ce9e403f5a266ff719a": [" "],
            "0xfc6664300e2ce056cb146b05edef3501ff8bd027c49a8dde866901679a24fb7e": [new Date(0).toString()],
        };

        for (const [key, values] of Object.entries(nullHashes)) {
            expect(key).to.match(constants.HASH_REGEX);

            for (const value of values) {
                expect(getHash(value)).to.deep.equal(key);
            }
        }
    });

    it("should be able to return uuid", () => {
        const uuid = getUUID();

        expect(uuid).to.match(constants.UUID_REGEX);
    });

    it("should be able to clone element", () => {
        const args = {a: Math.random()};

        const cloned = cloneElement(args);

        args.a = Math.random();

        expect(cloned).to.not.deep.equal(args);
    });

    it("should be able to parse without error", () => {
        const args = "{{";

        expect(() => JSON.parse(args)).to.throw();
        expect(JSONParseIgnoreError(args)).to.not.throw;
    });

    it("should be able to process regardless if array", () => {
        const args = 1;
        const arrayArgs = [1];
        const processFunc = (count) => ++count;

        expect(processRegardlessIfArray(args, processFunc)).to.deep.equal(2);
        expect(processRegardlessIfArray(arrayArgs, processFunc)).to.deep.equal([2]);
    });

    it("should be able to filter obj or array of objs props", () => {
        const args = {a: Math.random(), b: Math.random()};
        const arrayArgs = [{a: Math.random(), b: Math.random()}, {a: Math.random(), b: Math.random()}];
        const propToFilter = "b";
        const arrayPropsToFilter = ["a", "b"];

        expect(filterObjectOrArrayObjsProps(args, propToFilter, true)[propToFilter]).to.be.undefined;
        expect(filterObjectOrArrayObjsProps(arrayArgs, arrayPropsToFilter, true)).to.deep.equal([{}, {}]);
    });

    it("should be able to filter obj null props", () => {
        const args = {a: Math.random(), b: Math.random(), c: []};

        expect(filterObjectNullProperties(args, true)).to.not.deep.equal(args);
    });

    it("should be able to check if is null any", () => {
        const args = [{a: Math.random(), b: Math.random(), c: []}, [{}], {}];

        expect(isNullAny(...args)).to.be.true;
        expect(isNullAny(args[0])).to.be.false;
        expect(isNullAny(args[1])).to.be.false;
        expect(isNullAny(args[2])).to.be.true;
    });

    it("should be able to check if are not null all", () => {
        const args = [{a: Math.random(), b: Math.random(), c: []}, [{}], {}];

        expect(areNotNullAll(...args)).to.be.true;
        expect(areNotNullAll(args[0])).to.be.true;
        expect(areNotNullAll(args[1])).to.be.true;
        expect(areNotNullAll(args[2])).to.be.false;
    });

    it("should be able to check if are null all", () => {
        const args = [{a: Math.random(), b: Math.random(), c: []}, [{}], {}];

        expect(areNullAll(...args)).to.be.false;
        expect(areNullAll(args[0])).to.be.false;
        expect(areNullAll(args[1])).to.be.false;
        expect(areNullAll(args[2])).to.be.true;
    });

    it("should be able to check if is undefined any", () => {
        const args = [{a: Math.random(), b: Math.random(), c: []}, [{}], {}];

        expect(isUndefinedAny(...args)).to.be.false;
        expect(isUndefinedAny(args[0])).to.be.false;
        expect(isUndefinedAny(args[1])).to.be.false;
        expect(isUndefinedAny(args[2])).to.be.false;
        expect(isUndefinedAny(args[2].undefined)).to.be.true;
    });

    it("should be able to get unix time in seconds", () => {
        expect(getUnixTimeInSeconds()).to.be.lessThanOrEqual((new Date()).getTime() / 1000);
    });

    it("should be able to rename obj keys", () => {
        const args = {a: 1, b: 2};
        const expected = {pre_a_post: 1, pre_b_post: 2};

        expect(renameObjKeysWithPrefixSuffix(args, "pre_", "_post")).to.be.deep.equal(expected);
    });

    it("should be able to rename obj keys", () => {
        const args = getValidationError();
        const expected = {field: 'chunkHash', message: 'Validation is on chunkHash failed'};

        expect(processSequelizeValidationError(args)).to.be.deep.equal(expected);
    });

    it("should be able to write and read file", () => {
        const args = getBase64String();
        const path = `${__dirname}/test.file`;

        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        writeFile(args, path);

        expect(fs.existsSync(path)).to.be.true;

        const fileContent = readFile(path);
        fs.unlinkSync(path);

        expect(fileContent).to.deep.equal(args);
    });
});