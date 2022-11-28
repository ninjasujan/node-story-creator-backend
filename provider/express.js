const express = require("express");
const Locals = require("../configs/Locals");
const middleware = require("../app/middleware/http.middleware");
const apiRoutes = require("../app/routes/index");
const ErrorHandler = require("../exception/Hander");

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
        /** Mount all http middleware */
        middleware.mountMiddleware(this.app);

        /** Route level API */
        this.app.use("/api", apiRoutes.router);

        /** Not found 404 error */
        this.app.use(this.notFound);

        /** Global error handler to catch and handle all error */
        this.app.use(ErrorHandler.handler);
    };

    notFound = (req, res, next) => {
        res.status(404).json({
            status: "NotFound",
            message: "Route not found.!",
        });
    };
}

module.exports = new Express();
