const { S3Client } = require("@aws-sdk/client-s3");
const Locals = require("./Locals");

class S3 {
    constructor() {
        this.client = new S3Client({
            region: "us-east-1",
            credentials: {
                accessKeyId: Locals.AWS_ACCESS_KEY,
                secretAccessKey: Locals.AWS_SECRET_KEY,
            },
        });
    }
}

module.exports = new S3();
