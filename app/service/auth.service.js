const JWT = require("jsonwebtoken");
const Locals = require("../../configs/Locals");

class Auth {
    generateJWTToken = (payload) => {
        const token = JWT.sign(payload, Locals.EXPRESS_JWT_SECRET, {
            expiresIn: "1d",
        });
        return token;
    };
}

module.exports = new Auth();
