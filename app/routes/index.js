const express = require("express");
const userRoute = require("./user.route");
const feedRoute = require("./feed.route");

class Routes {
    constructor() {
        this.router = express.Router();
        this.router.use("/auth", userRoute.router);
        this.router.use("/feed", feedRoute.router);
    }
}

module.exports = new Routes();
