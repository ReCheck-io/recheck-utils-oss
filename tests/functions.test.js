;
describe("initialize ReCheck OSS utils", () => {

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
});