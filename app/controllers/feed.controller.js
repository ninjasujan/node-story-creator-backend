const { validationResult } = require("express-validator");
const PostModel = require("../model/post.model");
const HashTagModel = require("../model/hashtag.model");
const APIError = require("../../exception/APIError");
const ValidationError = require("../../exception/ValidationError");
const feedService = require("../service/feed.service");
const { ValidPostType } = require("../../constants/feed.constant");
const Locals = require("../../configs/Locals");

class Feed {
    /** Create user story
     * If post type hashtag create hashtag
     */
    createStory = async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors);
            }

            const userId = request.auth._id;
            const {
                title,
                description,
                tags,
                postType = ValidPostType.STORY,
            } = request.body;
            const { originalname, mimetype, buffer, size } = request.file;

            const isPostExist = await PostModel.findOne({ title });
            if (isPostExist) {
                throw new APIError("Post already created", 400);
            }

            const url =
                `https://${Locals.AWS_BUCKET_NAME}.s3.amazonaws.com/${userId}/${originalname}`.toString();

            // await feedService.uploadObjectToStorage(
            //     buffer,
            //     `${userId}/originalname`,
            //     mimetype,
            //     size
            // );

            let story;
            /** Post Type is POST create POST */
            if (postType === ValidPostType.STORY) {
                story = await new PostModel({
                    title,
                    description,
                    url,
                    userId,
                    tags,
                }).save();
            }

            /** Post Type is HashTag create HashTag */
            if (postType === ValidPostType.HASHTAG) {
                story = await new HashTagModel({
                    title,
                    description,
                    url,
                    userId,
                }).save();
            }

            response.status(200).json({
                status: "success",
                message: "Feed story created",
                data: {
                    type: postType,
                    story: story,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    fetchUserPost = async (request, response, next) => {
        const userId = request.auth._id;
        const posts = await PostModel.find({ userId }).sort({ createdAt: -1 });
        response.status(200).json({
            status: "success",
            message: "User story list",
            data: {
                posts,
            },
        });
    };
}

module.exports = new Feed();
