const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
            unique: true,
            minLength: 3,
            maxLength: 20,
        },
        description: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 3000,
        },
        url: {
            type: String,
            required: true,
        },
        hashTag: [{ type: mongoose.Schema.Types.ObjectId, ref: "HashTag" }],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
