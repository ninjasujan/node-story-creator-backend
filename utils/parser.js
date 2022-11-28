const multer = require("multer");
const path = require("path");
const APIError = require("../exception/APIError");
const {
    ATTACHMENT_MAX_SIZE,
    ValidFileType,
} = require("../constants/feed.constant");
const { FeedError } = require("../constants/error.constant");

class Util {
    formDataParser = () => {
        const storage = multer.memoryStorage();
        const fileUploadStrategy = multer({
            storage: storage,
            limits: {
                fileSize: ATTACHMENT_MAX_SIZE,
            },
            fileFilter: function (req, file, cb) {
                const extension = path
                    .extname(file.originalname)
                    ?.toUpperCase();

                if (!extension) {
                    cb(new APIError(FeedError.fileTypeErrorMessage, 422));
                }
                if (!Object.values(ValidFileType).includes(extension)) {
                    cb(new APIError(FeedError.fileTypeErrorMessage, 422));
                }
                cb(null, true);
            },
        }).single("attachment");
        return fileUploadStrategy;
    };
}

module.exports = new Util();
