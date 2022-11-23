const mongoose = require("mongoose");
const Locals = require("../configs/Locals");

class MongoDB {
    static init() {
        /** Setup MongoDB connection */
        mongoose.connect(Locals.MONGO_DATABASE_URL);

        mongoose.connection.on("connected", () => {
            console.log("[MongoDB Database connected]");
        });

        mongoose.connection.on("error", () => {
            Logger.info("[Mongoose connection Error]");
        });

        mongoose.connection.on("disconnected", () => {
            console.log(`[Mongoose connection disconnected`);
        });
    }
}

module.exports = MongoDB;
