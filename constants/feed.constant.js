const Locals = require("../configs/Locals");

const ATTACHMENT_MAX_SIZE = 3000000;

const ValidFileType = {
    JPEG: ".JPEG",
    PNG: ".PNG",
    JPG: ".JPG",
};

const ValidPostType = {
    STORY: "STORY",
    HASHTAG: "HASHTAG",
};

const S3_BUCKET_PREFIX = `https://${Locals.AWS_BUCKET_NAME}.s3.amazonaws.com`;

module.exports = {
    ATTACHMENT_MAX_SIZE,
    ValidFileType,
    ValidPostType,
    S3_BUCKET_PREFIX,
};
