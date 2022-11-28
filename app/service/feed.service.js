const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const S3 = require("../../configs/s3.clinet");
const Locals = require("../../configs/Locals");

class Feed {
    uploadObjectToStorage = async (buffer, fileName, mimeType, size) => {
        await S3.client.send(
            new PutObjectCommand({
                Bucket: Locals.AWS_BUCKET_NAME,
                Body: buffer,
                Key: fileName,
                ContentType: mimeType,
                ContentLength: size,
            })
        );
    };

    deleteObjectFromStorage = async (fileName) => {
        await S3.client.send(
            new DeleteObjectCommand({
                Bucket: Locals.AWS_BUCKET_NAME,
                Key: fileName,
            })
        );
    };
}

module.exports = new Feed();
