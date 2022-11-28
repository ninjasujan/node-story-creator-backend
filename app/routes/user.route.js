const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const { AuthError } = require("../../constants/error.constant");

class UserRoute {
    constructor() {
        this.router = express.Router();
        this.router.post(
            "/signup",
            [
                body("userName", AuthError.userNameErrorMessage)
                    .isString()
                    .isLength({ min: 5 }),
                body("password", AuthError.passwordErrorMessage)
                    .isString()
                    .isLength({ min: 8 }),
            ],
            userController.userSignup
        );

        this.router.post(
            "/login",
            [
                body("userName", AuthError.userNameErrorMessage)
                    .isString()
                    .isLength({ min: 5 }),
                body("password", AuthError.passwordErrorMessage)
                    .isString()
                    .isLength({ min: 8 }),
            ],
            userController.userLogin
        );
    }
}

module.exports = new UserRoute();
