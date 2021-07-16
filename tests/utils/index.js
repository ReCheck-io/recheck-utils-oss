;
const {ValidationError} = require("sequelize");


function getValidationError() {
    return new ValidationError(
        "SequelizeValidationError",
        [
            {
                "message": "Validation is on chunkHash failed",
                "type": "Validation error",
                "path": "chunkHash",
                "value": "070012edd1070753c180b7528cf649fac459e439c0dff05597776a2f76a1da86f",
                "origin": "FUNCTION",
                "instance": {
                    "createdAt": 1626425951,
                    "updatedAt": 1626425951,
                    "id": null,
                    "userId": 480,
                    "dataId": 457,
                    "chunkId": 1,
                    "chunksCount": 1,
                    "chunkHash": "070012edd1070753c180b7528cf649fac459e439c0dff05597776a2f76a1da86f",
                    "dataContent": "MC4xNjUyMzYyNzkxNTQ4MTM4Nw=="
                },
                "validatorKey": "is",
                "validatorName": "is",
                "validatorArgs": [
                    {}
                ],
                "original": {
                    "validatorName": "is",
                    "validatorArgs": [
                        {}
                    ]
                }
            }
        ]);
}

function getBase64String() {
    return "MC4xNjUyMzYyNzkxNTQ4MTM4Nw==";
}


module.exports = {
    getValidationError,
    getBase64String,
}