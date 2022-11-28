const { UnauthorizedError } = require("express-jwt");

class ErrorHandler {
    static handler = (error, request, response, next) => {
        console.log("[API Error]", error);

        let statusCode = 500,
            message = "Internal Server Error - Please fix it in priority",
            status = "InternalServerError";

        if (error.name === "APIError") {
            status = error.name;
            statusCode = error.status;
            message = error.message;
        }

        if (error.name === "ValidationError") {
            status = error.name;
            statusCode = 422;
            message = error.message;
        }

        if (
            error.name === "AuthorizationError" ||
            error.name === "UnauthorizedError"
        ) {
            status = error.name;
            statusCode = error.status;
            message = error.message;
        }

        response.status(statusCode).json({
            status,
            message,
        });

        next();
    };
}

module.exports = ErrorHandler;
