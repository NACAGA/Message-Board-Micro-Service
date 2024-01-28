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
// Test
async function createLike(req) {
    try {
        let mediaType;
        if (req.params.mediatype === 'post') {
            mediaType = MediaType.Post;
            const verifyPostExistsResult = await verifyPostExists(req.params.mediaid);
            if (verifyPostExistsResult instanceof Error.BusinessError) {
                return verifyPostExistsResult;
            }
        } else if (req.params.mediatype === 'comment') {
            mediaType = MediaType.Comment;
            const verifyCommentExistsResult = await verifyCommentExists(req.params.mediaid);
            if (verifyCommentExistsResult instanceof Error.BusinessError) {
                return verifyCommentExistsResult;
            }
        } else {
            return new Error.InvalidMediaTypeError(req.params.mediatype);
        }

        const verifyUserHasNotLikedResult = await verifyUserHasNotLiked(req.params.userid, mediaType, req.params.mediaid);
        if (verifyUserHasNotLikedResult instanceof Error.BusinessError) {
            return verifyUserHasNotLikedResult;
        }

        const createLikeResult = await createLikeQuery(req.params.userid, mediaType, req.params.mediaid);
        if (createLikeResult instanceof Error.BusinessError) {
            return createLikeResult;
        }

        return new CreateLikeSuccess(req.params.userid, mediaType, req.params.mediaid);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
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
    const queryResult = await db.query('SELECT * FROM Likes WHERE user_id = ? AND media_type = ? AND media_id = ?', [
        userid,
        mediatype,
        mediaid,
    ]);
    if (queryResult.result.length > 0) {
        return new Error.UserHasAlreadyLikedError(userid, mediatype, mediaid);
    }
    return queryResult;
}

async function createLikeQuery(userid, mediatype, mediaid) {
    const queryResult = await db.query('INSERT INTO Likes (user_id, media_type, media_id) VALUES (?, ?, ?)', [userid, mediatype, mediaid]);

    if (queryResult.result.affectedRows === 0) {
        return new Error.CreateLikeError();
    }

    return queryResult;
}

module.exports = {
    createLike,
};
