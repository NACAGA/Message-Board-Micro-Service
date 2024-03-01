const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');
const db = require('./db.service');
const MediaType = require('./domain/MediaTypeEnum.domain');
const utils = require('../utils/messageBoard.util');
class ToggleLikeSuccess extends Success {
    constructor(userid, mediatype, mediaid) {
        super();
        this.code = 200;
        this.message = 'Like toggled';
        this.userid = userid;
        this.mediatype = mediatype;
        this.mediaid = mediaid;
    }
}

class GetLikeCountSuccess extends Success {
    constructor(count, mediaType, mediaId) {
        super();
        this.message = 'Like count retrieved';
        this.count = count;
        this.mediaType = mediaType;
        this.mediaId = mediaId;
    }
}

async function toggleLike(req) {
    try {
        let mediaType;
        if (req.params.mediatype === 'post') {
            mediaType = MediaType.Post;
            const verifyPostExistsResult = await verifyPostExistsQuery(req.params.mediaid);
            if (verifyPostExistsResult instanceof Error.BusinessError) {
                return verifyPostExistsResult;
            }
        } else if (req.params.mediatype === 'comment') {
            mediaType = MediaType.Comment;
            const verifyCommentExistsResult = await verifyCommentExistsQuery(req.params.mediaid);
            if (verifyCommentExistsResult instanceof Error.BusinessError) {
                return verifyCommentExistsResult;
            }
        } else {
            return new Error.InvalidMediaTypeError(req.params.mediatype);
        }

        const toggleLikeResult = await toggleLikeQuery(req.params.userid, mediaType, req.params.mediaid);
        if (toggleLikeResult instanceof Error.BusinessError) {
            return toggleLikeResult;
        }

        return new ToggleLikeSuccess(req.params.userid, mediaType, req.params.mediaid);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function verifyPostExistsQuery(postid) {
    const queryResult = await db.query('SELECT * FROM Posts WHERE id = ?', [postid]);
    if (queryResult.result.length === 0) {
        return new Error.PostNotFoundError(postid);
    }
    return queryResult;
}

async function verifyCommentExistsQuery(commentid) {
    const queryResult = await db.query('SELECT * FROM Comments WHERE id = ?', [commentid]);
    if (queryResult.result.length === 0) {
        return new Error.CommentNotFoundError(commentid);
    }
    return queryResult;
}

async function hasUserAlreadyLikedQuery(userid, mediatype, mediaid) {
    const queryResult = await db.query('SELECT * FROM Likes WHERE user_id = ? AND media_type = ? AND media_id = ?', [
        userid,
        mediatype,
        mediaid,
    ]);
    if (queryResult instanceof Error.BusinessError) {
        return queryResult;
    }
    if (queryResult.result.length > 0) {
        return true;
    }
    return false;
}

async function toggleLikeQuery(userid, mediatype, mediaid) {
    const hasUserAlreadyLiked = await hasUserAlreadyLikedQuery(userid, mediatype, mediaid);
    if (hasUserAlreadyLiked instanceof Error.BusinessError) {
        return hasUserAlreadyLiked;
    }
    let queryResult;
    if (hasUserAlreadyLiked) {
        queryResult = await db.query('DELETE FROM Likes WHERE user_id = ? AND media_type = ? AND media_id = ?', [
            userid,
            mediatype,
            mediaid,
        ]);
    } else {
        queryResult = await db.query('INSERT INTO Likes (user_id, media_type, media_id) VALUES (?, ?, ?)', [userid, mediatype, mediaid]);
    }
    if (queryResult instanceof Error.BusinessError) {
        return queryResult;
    }

    if (queryResult.result.affectedRows === 0) {
        return new Error.CreateLikeError();
    }

    return queryResult;
}

async function getLikeByLikeId(likeid) {
    const actualId = await utils.parseId(likeid.params.likeid);
    if (actualId instanceof Error.InvalidIdError) {
        return new Error.InvalidIdError(actualId);
    }
    const queryResult = await db.query('SELECT * FROM Likes WHERE id = ?', [actualId]);
    if (queryResult.result.length === 0) {
        return new Error.LikeNotFoundError(actualId);
    }
    return queryResult;
}

async function userExists(userid) {
    const actualId = await utils.parseId(userid);
    if (actualId instanceof Error.InvalidIdError) {
        return new Error.InvalidIdError(actualId);
    }
    const queryResult = await db.query('SELECT * FROM GroupMembers WHERE id = ?', [actualId]);
    if (queryResult.result.length === 0) {
        return new Error.UserNotFoundError(actualId);
    }
    return queryResult;
}

async function getLikesByUserId(userid) {
    const actualId = await utils.parseId(userid.params.userid);
    if (actualId instanceof Error.InvalidIdError) {
        return new Error.InvalidIdError(actualId);
    }
    if ((await userExists(actualId)) instanceof Error.UserNotFoundError) {
        return new Error.UserNotFoundError(actualId);
    }
    const queryResult = await db.query('SELECT * FROM Likes WHERE user_id = ?', [actualId]);
    return queryResult;
}

async function getLikesByMediaTypeAndId(req) {
    const mediaType = req.params.mediatype;
    const mediaId = await utils.parseId(req.params.mediaid);

    if (mediaId instanceof Error.InvalidIdError) {
        return new Error.InvalidIdError(mediaId);
    }
    const queryResult = await db.query('SELECT * FROM Likes WHERE media_type = ? AND media_id = ?', [mediaType, mediaId]);
    console.log(req.query);
    if (req.query.count) {
        return new GetLikeCountSuccess(queryResult.result.length, req.params.mediatype, req.params.mediaid);
    }
    return queryResult;
}

module.exports = {
    toggleLike,
    getLikeByLikeId,
    getLikesByUserId,
    getLikesByMediaTypeAndId,
};
