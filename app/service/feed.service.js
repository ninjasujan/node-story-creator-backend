const { PutObjectCommand } = require("@aws-sdk/client-s3");
const S3 = require("../../configs/s3.clinet");
const Locals = require("../../configs/Locals");

class Feed {
    uploadObjectToStorage = async (buffer, fileName, mimeType, size) => {
        console.log(Locals.AWS_BUCKET_NAME);
        await S3.client.send(
            new PutObjectCommand({
                Bucket: "feedstore",
                Body: buffer,
                Key: fileName,
                ContentType: mimeType,
                ContentLength: size,
            })
        );
    };
}

module.exports = new Feed();
