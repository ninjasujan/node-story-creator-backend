const express = require("express");
const Locals = require("../../configs/Locals");
const { expressjwt } = require("express-jwt");

class Middleware {
    mountMiddleware = (_express) => {
        /** App level middleware */
        _express.use(express.urlencoded({ extended: true }));
        _express.use(express.json());

        /** Auth token validator */
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
