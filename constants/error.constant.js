const AuthError = {
    userNameErrorMessage:
        "User name must be a valid string with minimum 5 char long",
    passwordErrorMessage:
        "Password must be a valid string with minimum 8 char long",
};

const FeedError = {
    titleErrorMessage:
        "Title should be unique and minimum 3 char long and max 20 char",
    descriptionErrorMessage:
        "Title should be unique and minimum 3 char long and max 20 char",
    tagsErrorMessage: "Tags must be a valid tags",
    fileTypeErrorMessage:
        "Not supported file type (Use only jpeg, jpg and png format)",
    postTypeErrorMessage: "Not a valid post type (STORY/HASHTAG)",
};

module.exports = {
    AuthError,
    FeedError,
};
