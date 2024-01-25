const Success = require('./domain/success.domain');
const Error = require('./domain/errors.domain');
const db = require('./db.service');
const utils = require('../utils/messageBoard.util');

class CreateGroupSuccess extends Success {
    constructor(id, name, description) {
        super();
        this.code = 200;
        this.message = 'Group created';
        this.id = id;
        this.name = name;
        this.description = description;
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
            const newGroup = await getGroupById(createGroupResult.result.insertId);

            if (newGroup instanceof Error.BusinessError) {
                return newGroup;
            }

            return new CreateGroupSuccess(newGroup.id, newGroup.name, newGroup.description);
        }

        return new Error.CreateGroupError();
    } catch (error) {
        // Handle unexpected errors here
        console.error(error);
        return new Error.UnknownError();
    }
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

module.exports = { createGroup };
