const express = require("express");
const Locals = require("../configs/Locals");
const appRoute = require("../app/routes/app.route");

class Express {
    init = () => {
        this.app = express();

        /** Mount all route leval and app level middleware */
        this.mountRoute();

        this.app.listen(Locals.EXPRESS_SERVER_PORT, () => {
            console.log("[SERVER RUNNING IN PORT]", Locals.EXPRESS_SERVER_PORT);
        });
    };

    mountRoute = () => {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use("/api", appRoute.router);
        this.app.use(this.notFound);
        this.app.use(this.errorHandler);
    };

    notFound = (req, res, next) => {
        res.status(404).json({ message: "Route not found.!" });
    };

    errorHandler = (err, req, res, next) => {
        console.log("[Error in API]", err);
        const message = err.message;
        res.status(400).json({ message });
    };
}

module.exports = new Express();
