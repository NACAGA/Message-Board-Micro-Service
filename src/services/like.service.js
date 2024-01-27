const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');
const db = require('./db.service');
const MediaType = require('./domain/MediaTypeEnum.domain');

class CreateLikeSuccess extends Success {
    constructor(userid, mediatype, mediaid) {
        super();
        this.code = 200;
        this.message = 'Like created';
        this.userid = userid;
        this.mediatype = mediatype;
        this.mediaid = mediaid;
    }
}

async function createLike(req) {
    try {
        let mediaType;
        if (req.body.mediatype === MediaType.Post) {
            mediaType = MediaType.Post;
            const verifyPostExistsResult = await verifyPostExists(req.body.mediaid);
            if (verifyPostExistsResult instanceof Error.BusinessError) {
                return verifyPostExistsResult;
            }

        } else if (req.body.mediatype === MediaType.Comment) {
            mediaType = MediaType.Comment;
            const verifyCommentExistsResult = await verifyCommentExists(req.body.mediaid);
            if (verifyCommentExistsResult instanceof Error.BusinessError) {
                return verifyCommentExistsResult;
            }
        }
        else {
            return new Error.InvalidMediaTypeError(req.body.mediatype);
        }

        const verifyUserHasNotLikedResult = await verifyUserHasNotLiked(req.body.userid, mediaType, req.body.mediaid);
            if (verifyUserHasNotLikedResult instanceof Error.BusinessError) {
                return verifyUserHasNotLikedResult;
            }
    }
}

async function verifyPostExists(postid) {
    const queryResult = await db.query('SELECT * FROM Posts WHERE id = ?', [postid]);
    if (queryResult.result.length === 0) {
        return new Error.PostNotFoundError(postid);
    }
    return queryResult;
}

async function verifyCommentExists(commentid) {
    const queryResult = await db.query('SELECT * FROM Comments WHERE id = ?', [commentid]);
    if (queryResult.result.length === 0) {
        return new Error.CommentNotFoundError(commentid);
    }
    return queryResult;
}

async function verifyUserHasNotLiked(userid, mediatype, mediaid) {
    const queryResult = await db.query('SELECT * FROM Likes WHERE user_id = ? AND media_type = ? AND media_id = ?', [userid, mediatype, mediaid]);
    if (queryResult.result.length > 0) {
        return new Error.UserHasAlreadyLikedError(userid, mediatype, mediaid);
    }
    return queryResult;
}

async function createLikeQuery(userid, mediatype, mediaid) {
    const queryResult = await db.query('INSERT INTO Likes (user_id, media_type, media_id) VALUES (?, ?, ?)', [
        userid,
        mediatype,
        mediaid,
    ]);

    if (queryResult.result.affectedRows === 0) {
        return new Error.CreateLikeError();
    }

    return queryResult;
}

module.exports = {
    createLike,
};
