const db = require('./db.service');
const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');

class AddUserSuccess extends Success {
    constructor(userid, groupid, groupName, joinedOn) {
        super();
        this.code = 200;
        this.message = 'User added to group';
        this.groupid = groupid;
        this.userid = userid;
        this.groupName = groupName;
        this.joinedOn = joinedOn;
    }
}

async function addUser(req) {
    const validateGroupExistsResult = await validateGroupExists(req.params.groupid);
    if (validateGroupExistsResult instanceof Error.BusinessError) {
        return validateGroupExistsResult;
    }
    const groupName = validateGroupExistsResult.result[0].name;

    const validateUserIsntInGroupResult = await validateUserIsntInGroup(req.params.userid, req.params.groupid);
    if (validateUserIsntInGroupResult instanceof Error.BusinessError) {
        return validateUserIsntInGroupResult;
    }

    const joinedOn = new Date();
    const addUserToGroupResult = await addUserToGroup(req.params.userid, req.params.groupid, joinedOn);
    if (addUserToGroupResult instanceof Error.BusinessError) {
        return addUserToGroupResult;
    }

    return new AddUserSuccess(req.params.userid, req.params.groupid, groupName, joinedOn);
}

async function validateGroupExists(groupid) {
    const queryResult = await db.query('SELECT * FROM Groups WHERE id=?', [groupid]);
    if (queryResult.result.length === 0) {
        return new Error.GroupNotFoundError(groupid);
    }
    return queryResult;
}

async function validateUserIsntInGroup(userid, groupid) {
    const queryResult = await db.query('SELECT * FROM GroupMembers WHERE user_id=? AND group_id=?', [userid, groupid]);
    if (queryResult.result.length > 0) {
        return new Error.UserAlreadyInGroupError(userid, groupid);
    }
    return queryResult;
}

async function addUserToGroup(userid, groupid, joinedOn) {
    const queryResult = await db.query('INSERT INTO GroupMembers (user_id, group_id, joined_on) VALUES (?, ?, ?)', [
        userid,
        groupid,
        joinedOn,
    ]);
    if (queryResult.result.affectedRows === 0) {
        return new Error.AddUserToGroupError(userid, groupid);
    }
}

module.exports = {
    addUser,
};
