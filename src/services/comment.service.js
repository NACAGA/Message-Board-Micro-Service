const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');
const db = require('./db.service');
const utils = require('../utils/messageBoard.util');

class CreateCommentSuccess extends Success {
    constructor(userid, postid) {
        super();
        this.code = 200;
        this.message = 'Comment created';
        this.postid = postid;
        this.userid = userid;
    }
}

class GetCommentsSuccess extends Success {
    constructor(comments) {
        super();
        this.code = 200;
        this.comments = comments;
    }
}

class GetCommentByIdSuccess extends GetCommentsSuccess {
    constructor(comments) {
        super(comments);
    }
}

class GetCommentByPostSuccess extends GetCommentsSuccess {
    constructor(comments, postid) {
        super(comments);
        this.postid = postid;
    }
}

class GetUserCommentsSuccess extends GetCommentsSuccess {
    constructor(comments, userid) {
        super(comments);
        this.userid = userid;
    }
}

async function createComment(req) {
    try {
        const verifyUserIsInGroupResult = await verifyUserIsInGroup(req.params.userid, req.params.postid);
        if (verifyUserIsInGroupResult instanceof Error.BusinessError) {
            return verifyUserIsInGroupResult;
        }

        const postedOnDate = new Date();
        const createCommentResult = await createCommentQuery(req.params.userid, req.params.postid, req.body.content, postedOnDate);
        if (createCommentResult instanceof Error.BusinessError) {
            return createCommentResult;
        }

        return new CreateCommentSuccess(req.params.userid, req.params.postid);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function getCommentById(req) {
    try {
        const getCommentByIdResult = await getCommentByIdQuery(req.params.commentid);
        if (getCommentByIdResult instanceof Error.BusinessError) {
            return getCommentByIdResult;
        }

        const comments = [];
        for (const comment of getCommentByIdResult.result) {
            comments.push(utils.convertComment(comment));
        }

        return new GetCommentByIdSuccess(comments);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function getPostComments(req) {
    try {
        const verifyPostExistsResult = await verifyPostExists(req.params.postid);
        if (verifyPostExistsResult instanceof Error.BusinessError) {
            return verifyPostExistsResult;
        }

        const getCommentsResult = await getPostCommentsQuery(req.params.postid);
        if (getCommentsResult instanceof Error.BusinessError) {
            return getCommentsResult;
        }

        const comments = [];
        for (const comment of getCommentsResult.result) {
            comments.push(utils.convertComment(comment));
        }

        return new GetCommentByPostSuccess(comments, req.params.postid);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function getUserComments(req) {
    try {
        const getCommentsResult = await getCommentByUserQuery(req.params.userid);
        if (getCommentsResult instanceof Error.BusinessError) {
            return getCommentsResult;
        }

        const comments = [];
        for (const comment of getCommentsResult.result) {
            comments.push(utils.convertComment(comment));
        }

        return new GetUserCommentsSuccess(comments, req.params.userid);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function verifyUserIsInGroup(userid, postid) {
    const getPostGroupId = await db.query('SELECT group_id FROM Posts WHERE id = ?', [postid]);
    if (getPostGroupId.result.length === 0) {
        return new Error.PostNotFoundError(postid);
    }
    const groupid = getPostGroupId.result[0].group_id;

    const queryResult = await db.query('SELECT * FROM GroupMembers WHERE user_id = ? AND group_id = ?', [userid, groupid]);
    if (queryResult.result.length === 0) {
        return new Error.UserNotInGroupError(userid, groupid);
    }
    return queryResult;
}

async function verifyPostExists(postid) {
    const queryResult = await db.query('SELECT * FROM Posts WHERE id = ?', [postid]);
    if (queryResult.result.length === 0) {
        return new Error.PostNotFoundError(postid);
    }
    return queryResult;
}

async function getPostCommentsQuery(postid) {
    return await db.query('SELECT * FROM Comments WHERE post_id = ?', [postid]);
}

async function createCommentQuery(userid, postid, content, commentedOnDate) {
    const queryResult = await db.query('INSERT INTO Comments (user_id, post_id, content, created_at) VALUES (?, ?, ?, ?)', [
        userid,
        postid,
        content,
        commentedOnDate,
    ]);

    if (queryResult.result.affectedRows === 0) {
        return new Error.CreateCommentError();
    }

    return queryResult;
}

async function getCommentByIdQuery(commentid) {
    const queryResult = await db.query('SELECT * FROM Comments WHERE id = ?', [commentid]);
    if (queryResult.result.length === 0) {
        return new Error.CommentNotFoundError(commentid);
    }
    return queryResult;
}

async function getCommentByUserQuery(userid) {
    return await db.query('SELECT * FROM Comments WHERE user_id = ?', [userid]);
}

module.exports = { createComment, getCommentById, getPostComments, getUserComments };
