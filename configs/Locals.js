const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

module.exports = {
    EXPRESS_SERVER_PORT: process.env.EXPRESS_SERVER_PORT,
    MONGO_DATABASE_URL: process.env.MONGO_DATABASE_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
    EXPRESS_JWT_SECRET: process.env.EXPRESS_JWT_SECRET,

    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
};
