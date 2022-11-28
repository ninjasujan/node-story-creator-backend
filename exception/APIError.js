class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        Object.setPrototypeOf(this, APIError.prototype);
        this.name = "APIError";
        this.status = statusCode || 401;
    }
}

module.exports = APIError;
