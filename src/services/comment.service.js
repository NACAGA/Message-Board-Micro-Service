const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');
const db = require('./db.service');

class CreateCommentSuccess extends Success {
    constructor(userid, postid) {
        super();
        this.code = 200;
        this.message = 'Comment created';
        this.postid = postid;
        this.userid = userid;
    }
}

async function createComment(req) {
    try {
        const validatePostExistsResult = await validatePostExists(req.params.postid);
        if (validatePostExistsResult instanceof Error.BusinessError) {
            return validatePostExistsResult;
        }

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

async function validatePostExists(groupid) {
    const sql = 'SELECT * FROM Groups WHERE id = ?';
    const params = [groupid];
    const result = await db.query(sql, params);
    if (result.result.length === 0) {
        return new Error.GroupNotFoundError(groupid);
    }
    return result;
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

async function createCommentQuery(userid, groupid, content, postedOnDate) {
    const queryResult = await db.query('INSERT INTO Posts (user_id, group_id, content, created_at) VALUES (?, ?, ?, ?)', [
        userid,
        groupid,
        content,
        postedOnDate,
    ]);

    if (queryResult.result.affectedRows === 0) {
        return new Error.CreateCommentError();
    }

    return queryResult;
}

async function getCommentById(postid) {
    const queryResult = await db.query('SELECT * FROM Comments WHERE id = ?', [postid]);
    if (queryResult.result.length === 0) {
        return new Error.PostNotFoundError(postid);
    }
    return queryResult;
}

module.exports = { createComment };
