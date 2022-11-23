const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

module.exports = {
    EXPRESS_SERVER_PORT: process.env.EXPRESS_SERVER_PORT,
    MONGO_DATABASE_URL: process.env.MONGO_DATABASE_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
};
