class ValidationError extends Error {
    constructor(error) {
        super("");
        Object.setPrototypeOf(this, ValidationError.prototype);
        const errors = error.array();
        let message = errors.reduce(
            (prevValue, currentValue) => `${prevValue + currentValue.msg}, `,
            ""
        );
        message = message.slice(0, -2);
        this.message = message;
        this.name = "ValidationError";
        this.status = 422;
    }
}

module.exports = ValidationError;
