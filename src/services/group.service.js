const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');
const db = require('./db.service');
const utils = require('../utils/messageBoard.util');
const User = require('./domain/User.domain');

class CreateGroupSuccess extends Success {
    constructor(group) {
        super();
        this.code = 200;
        this.message = 'Group created';
        this.group = group;
    }
}

class GetAllGroupsSuccess extends Success {
    constructor(groups) {
        super();
        this.code = 200;
        this.message = 'Groups retrieved';
        this.groups = groups;
    }
}

class GetGroupByIdSuccess extends Success {
    constructor(group) {
        super();
        this.code = 200;
        this.message = 'Group retrieved';
        this.group = group;
    }
}

class GetUserGroupSuccess extends Success {
    constructor(user, group) {
        super();
        this.code = 200;
        this.message = 'Group retrieved';
        this.user = user;
        this.groups = group;
    }
}

class GetGroupsUserNotInSuccess extends Success {
    constructor(groups) {
        super();
        this.code = 200;
        this.message = 'Groups retrieved';
        this.groups = groups;
    }
}

async function getGroups(req) {
    try {
        if (req.params.groupid) {
            return await getRequestedGroupById(req.params.groupid);
        }
        return getAllGroups();
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

// Defaults to the groups a user is in, but can be used to get groups a user is not in
async function getGroupsByUserId(req) {
    try {
        let queriedGroups;
        if (req.query.notIn) {
            const getGroupsUserNotInResult = await getGroupsUserNotIn(req.params.userid);
            if (getGroupsUserNotInResult instanceof Error.BusinessError) {
                return getGroupsUserNotInResult;
            }
            queriedGroups = getGroupsUserNotInResult;
        } else {
            const getUsersGroupsResult = await getAllGroupsAUserIsIn(req.params.userid);
            if (getUsersGroupsResult instanceof Error.BusinessError) {
                return getUsersGroupsResult;
            }
            queriedGroups = getUsersGroupsResult;
        }

        const user = new User(req.params.userid);
        const groups = [];

        for (const group of queriedGroups.result) {
            groups.push(utils.convertGroup(group));
        }

        return new GetUserGroupSuccess(user, groups);
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function createGroup(group) {
    try {
        const validateGroupResult = await validateGroup(group);

        if (validateGroupResult instanceof Error.BusinessError) {
            return validateGroupResult;
        }

        const createGroupResult = await createGroupInDatabase(group);

        if (createGroupResult instanceof Error.BusinessError) {
            return createGroupResult;
        }

        if (createGroupResult.result.affectedRows > 0) {
            const newGroupResult = await getGroupById(createGroupResult.result.insertId);

            if (newGroupResult instanceof Error.BusinessError) {
                return newGroupResult;
            }
            const newGroup = utils.convertGroup(newGroupResult.result[0]);
            return new CreateGroupSuccess(newGroup);
        }

        return new Error.CreateGroupError();
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
}

async function getAllGroups() {
    const queryResult = await db.query('SELECT * FROM Groups');
    if (queryResult instanceof Error.BusinessError) {
        return queryResult;
    }
    const groups = [];
    for (const group of queryResult.result) {
        groups.push(utils.convertGroup(group));
    }

    return new GetAllGroupsSuccess(groups);
}

async function getRequestedGroupById(groupId) {
    const queryResult = await getGroupById(groupId);
    if (queryResult instanceof Error.BusinessError) {
        return queryResult;
    }
    if (queryResult.result.length === 0) {
        return new Error.GroupNotFoundError(groupId);
    }
    const group = utils.convertGroup(queryResult.result[0]);
    return new GetGroupByIdSuccess(group);
}

async function getAllGroupsAUserIsIn(userid) {
    const queryResult = await db.query(
        'SELECT g.id, g.name, g.description, g.created_at, gm.user_id, gm.joined_on FROM GroupMembers gm JOIN Groups g ON g.id = gm.group_id WHERE gm.user_id = ?;',
        [userid]
    );
    return queryResult;
}

async function getGroupsUserNotIn(userid) {
    const getAllUsersGroupsQueryResult = await getAllGroupsAUserIsIn(userid);
    console.log(getAllUsersGroupsQueryResult.result);
    if (getAllUsersGroupsQueryResult.result.length === 0) {
        return await db.query('SELECT * FROM Groups');
    }
    const groupIdsOfGroupsUserIsIn = getAllUsersGroupsQueryResult.result.map((group) => group.id);

    const placeholders = groupIdsOfGroupsUserIsIn.map(() => '?').join(', ');

    const queryResult = await db.query(`SELECT * FROM Groups WHERE id NOT IN (${placeholders})`, groupIdsOfGroupsUserIsIn);
    console.log(queryResult);
    return queryResult;
}

function validateGroupDoesntExist(queryResult, groupName) {
    if (queryResult.result.length > 0) {
        return new Error.GroupExistsError(groupName);
    }
    return queryResult; // Indicates success, no business error
}

async function validateGroup(group) {
    const queryResult = await db.query('SELECT * FROM Groups WHERE name=?', [group.name]);
    return validateGroupDoesntExist(queryResult, group.name);
}

async function createGroupInDatabase(group) {
    return await db.query('INSERT INTO Groups (name, description) VALUES (?, ?)', [group.name, group.description]);
}

async function getGroupById(groupId) {
    return await db.query('SELECT * FROM Groups WHERE id = ?', [groupId]);
}

module.exports = { createGroup, getGroups, getGroupsByUserId };
