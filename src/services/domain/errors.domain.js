class BusinessError {
    constructor() {
        this.message = '';
        this.code = 500;
    }

    getResponse() {
        const properties = { status: this.code, body: {} };
        for (let key in this) {
            if (this.hasOwnProperty(key) && typeof this[key] !== 'function' && key !== 'code') {
                properties.body[key] = this[key];
            }
        }
        return properties;
    }
}

class UnknownError extends BusinessError {
    constructor() {
        super();
        this.message = 'Unknown error';
        this.code = 500;
    }
}

class DatabaseError extends BusinessError {
    constructor(err) {
        super();
        this.message = 'Error querying the database';
        this.code = 500;
        this.error = err;
    }
}

class CreateGroupError extends BusinessError {
    constructor() {
        super();
        this.message = 'Group not created';
        this.code = 500;
    }
}

class GroupExistsError extends BusinessError {
    constructor(name) {
        super();
        this.message = 'Group already exists';
        this.name = name;
        this.code = 500;
    }
}

class UserAlreadyInGroupError extends BusinessError {
    constructor(userid, groupid) {
        super();
        this.message = 'User already in group';
        this.userid = userid;
        this.groupid = groupid;
        this.code = 500;
    }
}

class GroupNotFoundError extends BusinessError {
    constructor(groupid) {
        super();
        this.message = 'Group does not exist';
        this.id = groupid;
        this.code = 500;
    }
}

class AddUserToGroupError extends BusinessError {
    constructor(userid, groupid) {
        super();
        this.message = 'Unable to add user to group';
        this.userid = userid;
        this.groupid = groupid;
        this.code = 500;
    }
}

module.exports = {
    BusinessError,
    DatabaseError,
    CreateGroupError,
    GroupExistsError,
    UnknownError,
    GroupNotFoundError,
    AddUserToGroupError,
    UserAlreadyInGroupError,
};
