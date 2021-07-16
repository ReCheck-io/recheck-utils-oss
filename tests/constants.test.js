;
describe("test ReCheck OSS utils constants", () => {

    it("should be able to require constants", (done) => {
        try {
            const {constants} = require("../index.js");

            if (Object.values(constants).length <= 0) {
                throw new Error("Constants object is empty");
            }

            done();
        } catch (error) {
            console.log(error);
        }
    });
});