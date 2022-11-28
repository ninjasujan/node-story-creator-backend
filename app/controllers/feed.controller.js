const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const PostModel = require("../model/post.model");
const HashTagModel = require("../model/hashtag.model");
const APIError = require("../../exception/APIError");
const ValidationError = require("../../exception/ValidationError");
const feedService = require("../service/feed.service");
const {
    ValidPostType,
    S3_BUCKET_PREFIX,
} = require("../../constants/feed.constant");

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
                hashTag,
                postType = ValidPostType.STORY,
            } = request.body;
            const { originalname, mimetype, buffer, size } = request.file;

            const isPostExist = await PostModel.findOne({ title });
            if (isPostExist) {
                throw new APIError("Post already created", 400);
            }

            const url =
                `${S3_BUCKET_PREFIX}/${userId}/${originalname}`.toString();

            /** Upload object to s3 */
            await feedService.uploadObjectToStorage(
                buffer,
                `${userId}/originalname`,
                mimetype,
                size
            );

            let story;
            /** Post Type is POST create POST */
            if (postType === ValidPostType.STORY) {
                story = await new PostModel({
                    title,
                    description,
                    url,
                    userId,
                    hashTag,
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

    /** Ftech all post from user */
    fetchUserPost = async (request, response, next) => {
        try {
            const userId = request.auth._id;

            const stories = await PostModel.find({
                userId: mongoose.Types.ObjectId(userId),
            })
                .sort({
                    createdAt: -1,
                })
                .populate({ path: "userId", ref: "User", select: "userName" });

            if (stories.length === 0) {
                throw new APIError("No post found", 400);
            }

            response.status(200).json({
                status: "success",
                message: "User story list",
                data: {
                    stories,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    /** Fetcg post by title */
    fetchPostByTitle = async (request, response, next) => {
        try {
            const { title } = request.params;
            const story = await PostModel.findOne({ title }).populate({
                path: "userId",
                ref: "User",
                select: "userName",
            });
            if (!story) {
                throw new APIError("No post found", 400);
            }
            response.status(200).json({
                status: "success",
                message: "User story",
                data: {
                    story,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    /** Filter Post */
    filterPost = async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors);
            }

            const {
                title,
                hashTag = [],
                userId,
                startDate,
                endDate = new Date(),
            } = request.body;

            const queryFilter = {};
            /** Create Query filter as per user filter */
            if (title) {
                /** Regex with case insensitive search */
                const regex = new RegExp(`${title}`, "i");
                queryFilter["title"] = { $regex: regex };
            }
            if (hashTag.length) {
                queryFilter["hashTags"] = { hashTag: { $all: hashTag } };
            }
            if (userId) {
                queryFilter["userId"] = mongoose.Types.ObjectId(userId);
            }
            if (startDate) {
                queryFilter["createdAt"] = {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate),
                };
            }

            const stories = await PostModel.find(queryFilter)
                .sort({ createdAt: -1 })
                .populate({
                    path: "userId",
                    ref: "User",
                    select: "userName",
                });

            if (!stories.length) {
                throw new APIError(
                    "No stories found for given search filter",
                    404
                );
            }

            response.status(200).json({
                status: "success",
                message: "story list",
                data: {
                    stories,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    /** Delete Post */
    deletePost = async (request, response, next) => {
        try {
            const { _id, userName } = request.auth;
            const { storyId } = request.params;

            let post = await PostModel.findOne({ _id: storyId });
            if (!post) {
                throw new APIError("Post not found", 404);
            }

            if (String(post.userId) !== _id) {
                throw new APIError(
                    "User not authorized to delete this post",
                    404
                );
            }

            await PostModel.findByIdAndDelete({ _id: storyId });

            response.status(200).json({
                status: "success",
                message: "story deleted",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    };

    /** Update Post */
    updatePost = async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors);
            }

            const userId = request.auth._id;
            const { storyId } = request.params;
            const { title, description, hashTag } = request.body;

            const post = await PostModel.findOne({
                _id: mongoose.Types.ObjectId(storyId),
            });

            if (!post) {
                throw new APIError("Post not exists", 400);
            }

            const titleExist = await PostModel.findOne({ title });

            if (titleExist && String(titleExist._id) !== storyId) {
                throw new APIError(
                    "Title already exist with another post",
                    400
                );
            }

            if (String(post.userId) !== userId) {
                throw new APIError(
                    "User not authorized to update this post",
                    401
                );
            }

            let url;
            if (request.file) {
                const { originalname, mimetype, buffer, size } = request.file;
                const oldPath = post.url.replace(`${S3_BUCKET_PREFIX}/`, "");

                /** Delete old image from blob */
                await feedService.deleteObjectFromStorage(oldPath);

                /** Upload new image to blob */
                url =
                    `${S3_BUCKET_PREFIX}/${userId}/${originalname}`.toString();

                await feedService.uploadObjectToStorage(
                    buffer,
                    `${userId}/originalname`,
                    mimetype,
                    size
                );
            }

            if (title) {
                post.title = title;
            }
            if (description) {
                post.description = description;
            }
            if (post.hashTag) {
                post.hashTag = hashTag;
            }
            if (url) {
                post.url = url;
            }

            const updatedPost = await post.save();

            response.status(200).json({
                status: "success",
                message: "story updated",
                data: {
                    post: updatedPost,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new Feed();
