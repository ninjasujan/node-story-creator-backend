const express = require("express");
const { body } = require("express-validator");
const feedController = require("../controllers/feed.controller");
const { FeedError } = require("../../constants/error.constant");
const { ValidPostType } = require("../../constants/feed.constant");
const parser = require("../../utils/parser");

class Feed {
    constructor() {
        this.router = express.Router();

        /** Create user story route */
        this.router.post(
            "/create-story",
            parser.formDataParser(),
            [
                body("title", FeedError.titleErrorMessage)
                    .isString()
                    .isLength({ min: 3, max: 20 }),
                body("description", FeedError.descriptionErrorMessage)
                    .isString()
                    .isLength({ min: 10, max: 1000 }),
                body("hashTag", FeedError.tagsErrorMessage)
                    .isArray()
                    .optional(),
                body("postType", FeedError.postTypeErrorMessage).isIn(
                    Object.values(ValidPostType)
                ),
            ],
            feedController.createStory
        );

        /** fetch  post by title - toute */
        this.router.get("/fetch-story/:title", feedController.fetchPostByTitle);

        /** fetch all user post - DESC order route */
        this.router.get("/fetch-story", feedController.fetchUserPost);

        /** Search post based on filters */
        this.router.post(
            "/search-story",
            [
                body("title", FeedError.titleErrorMessage)
                    .isString()
                    .optional(),
                body("hashTag", FeedError.tagsErrorMessage)
                    .isArray()
                    .optional(),
                body("userId", "Provide valid user _id")
                    .isString()
                    .isLength({ min: 24, max: 24 })
                    .optional(),
            ],
            feedController.filterPost
        );

        /** Delete Story */
        this.router.delete("/delete-story/:storyId", feedController.deletePost);

        /** update Story */
        this.router.put(
            "/update-story/:storyId",
            parser.formDataParser(),
            feedController.updatePost
        );
    }
}

module.exports = new Feed();
