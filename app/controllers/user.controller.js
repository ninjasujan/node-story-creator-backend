const { validationResult } = require("express-validator");
const UserModel = require("../model/user.model");
const APIError = require("../../exception/APIError");
const ValidationError = require("../../exception/ValidationError");
const AuthorizationError = require("../../exception/AuthorizationError");
const authService = require("../service/auth.service");

class User {
    userSignup = async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors);
            }
            const { userName, password } = request.body;

            const user = await UserModel.findOne({ userName });
            if (user) {
                throw new APIError("Username already taken", 400);
            }

            /** Create user instance and hash password */
            const newUser = new UserModel({
                userName,
                password,
            });
            newUser.setPassword(password);
            /** Save user in Database */
            const savesUser = await newUser.save();

            response.status(200).json({
                status: "success",
                message: "User Login",
                data: {
                    user: savesUser,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    userLogin = async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors);
            }
            const { userName, password } = request.body;

            const user = await UserModel.findOne({ userName });
            if (!user) {
                throw new APIError("User not found", 404);
            }

            if (!user.validatePassword(password)) {
                throw new AuthorizationError(
                    "User not authorized - Password invalid",
                    401
                );
            }

            const token = authService.generateJWTToken({
                _id: user._id,
                userName: user.userName,
            });

            response.status(200).json({
                status: "success",
                message: "User login success",
                data: {
                    user,
                    accessToken: token,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new User();
