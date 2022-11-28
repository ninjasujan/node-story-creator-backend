class AuthorizationError extends Error {
    constructor(message, statusCode) {
        super(message);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
        this.name = "AuthorizationError";
        this.status = statusCode;
    }
}

module.exports = AuthorizationError;
