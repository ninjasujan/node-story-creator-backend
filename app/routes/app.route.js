const express = require("express");

class Routes {
    constructor() {
        this.router = express.Router();
        this.router.get("/publish", this.getPublish);
    }

    getPublish = async (req, res, next) => {
        try {
            res.status(200).json({
                status: "success",
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new Routes();
