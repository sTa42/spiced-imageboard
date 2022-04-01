module.exports.requireValidPictureData = (req, res, next) => {};
module.exports.requireValidCommentData = (req, res, next) => {
    if (
        isNaN(req.body.imageId) ||
        req.body.username.length === 0 ||
        req.body.comment.length === 0 ||
        typeof req.body.username != "string" ||
        typeof req.body.comment != "string"
    ) {
        return res.json({ success: false, message: "invalid input" });
    }
    next();
};
