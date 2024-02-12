const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');
const db = require('./db.service');
const utils = require('../utils/messageBoard.util');
class CreatePostSuccess extends Success {
    constructor(userid, groupid) {
        super();
        this.code = 200;
        this.message = 'Post created';
        this.groupid = groupid;
        this.userid = userid;
    }
}

class GetPostsSuccess extends Success {
    constructor(posts) {
        super();
        this.code = 200;
        this.message = 'Posts retrieved';
        this.posts = posts;
    }
}

async function createPost(req) {
    try {
        const validateGroupExistsResult = await validateGroupExists(req.params.groupid);
        if (validateGroupExistsResult instanceof Error.BusinessError) {
            return validateGroupExistsResult;
        }

        const verifyUserIsInGroupResult = await verifyUserIsInGroup(req.params.userid, req.params.groupid);
        if (verifyUserIsInGroupResult instanceof Error.BusinessError) {
            return verifyUserIsInGroupResult;
        }

        const postedOnDate = new Date();
        const createPostResult = await createPostQuery(req.params.userid, req.params.groupid, req.body.content, postedOnDate);
        if (createPostResult instanceof Error.BusinessError) {
            return createPostResult;
        }

        return new CreatePostSuccess(req.params.userid, req.params.groupid);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function validateGroupExists(groupid) {
    const sql = 'SELECT * FROM Groups WHERE id = ?';
    const params = [groupid];
    const result = await db.query(sql, params);
    if (result.result.length === 0) {
        return new Error.GroupNotFoundError(groupid);
    }
    return result;
}

async function parseId(originalId) {
    const id = parseInt(originalId);
    if (isNaN(id) || !Number(originalId)) {
        return new Error.InvalidIdError(id);
    }
    return id;
}

async function verifyUserIsInGroup(userid, groupid) {
    const queryResult = await db.query('SELECT * FROM GroupMembers WHERE user_id = ? AND group_id = ?', [userid, groupid]);
    if (queryResult.result.length === 0) {
        return new Error.UserNotInGroupError(userid, groupid);
    }
    return queryResult;
}

async function createPostQuery(userid, groupid, content, postedOnDate) {
    const queryResult = await db.query('INSERT INTO Posts (user_id, group_id, content, created_at) VALUES (?, ?, ?, ?)', [
        userid,
        groupid,
        content,
        postedOnDate,
    ]);

    if (queryResult.result.affectedRows === 0) {
        return new Error.CreatePostError();
    }

    return queryResult;
}

async function getPostById(postid) {
    const idToLookFor = await parseId(postid.params.postid);

    if (idToLookFor instanceof Error.InvalidIdError) {
        return new Error.InvalidIdError(idToLookFor);
    }

    const queryResult = await db.query('SELECT * FROM Posts WHERE id = ?', [idToLookFor]);
    if (queryResult.result.length === 0) {
        return new Error.PostNotFoundError(idToLookFor);
    }
    return queryResult;
}

async function getPostsByUserId(userid) {
    const idToLookFor = await parseId(userid.params.userid);

    if (idToLookFor instanceof Error.InvalidIdError) {
        return new Error.InvalidIdError(idToLookFor);
    }

    // first check if the user exists
    const userExists = await db.query('SELECT * FROM GroupMembers WHERE id = ?', [idToLookFor]);
    if (userExists.result.length === 0) {
        return new Error.UserNotFoundError(idToLookFor);
    }

    const queryResult = await db.query('SELECT * FROM Posts WHERE user_id = ?', [idToLookFor]);
    return queryResult;
}

async function getPostsByGroupId(groupid) {
    const idToLookFor = await parseId(groupid.params.groupid);

    if (idToLookFor instanceof Error.InvalidIdError) {
        return new Error.InvalidIdError(idToLookFor);
    }

    // first check if the group exists
    const groupExists = await db.query('SELECT * FROM Groups WHERE id = ?', [idToLookFor]);
    if (groupExists.result.length === 0) {
        return new Error.GroupNotFoundError(idToLookFor);
    }

    const queryResult = await db.query('SELECT * FROM Posts WHERE group_id = ?', [idToLookFor]);
    return queryResult;
}

async function getPostsByDate(req) {
    const daysToLookBack = req.params.days;
    let justIds;
    try {
        justIds = JSON.parse(req.query.ids);
    } catch (e) {
        justIds = false;
    }

    const queryResult = await getPostsByDateQuery(daysToLookBack);
    if (queryResult instanceof Error.BusinessError) {
        return queryResult;
    }

    const posts = [];

    for (const post of queryResult.result) {
        if (justIds) {
            posts.push({ id: post.id });
        } else {
            posts.push(utils.convertPost(post));
        }
    }
    return new GetPostsSuccess(posts);
}

async function getPostsByDateQuery(days) {
    const queryResult = await db.query('SELECT * FROM Posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]);
    return queryResult;
}

module.exports = { createPost, getPostById, getPostsByUserId, getPostsByGroupId, getPostsByDate };
