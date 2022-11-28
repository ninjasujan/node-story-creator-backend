const express = require("express");
const morgan = require("morgan");
const { expressjwt } = require("express-jwt");
const Locals = require("../../configs/Locals");

class Middleware {
    mountMiddleware = (_express) => {
        /** App level middleware */
        _express.use(express.urlencoded({ extended: true }));
        _express.use(express.json());
        _express.use(morgan("dev"));

        /** Auth token validator - to validate all request */
        _express.use(
            expressjwt({
                secret: Locals.EXPRESS_JWT_SECRET,
                algorithms: ["HS256"],
            }).unless({
                path: [
                    { url: "/api/auth/signup", method: "POST" },
                    { url: "/api/auth/login", method: "POST" },
                ],
            })
        );
    };
}

module.exports = new Middleware();
