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
    }
}

class DatabaseError extends BusinessError {
    constructor(err) {
        super();
        this.message = 'Error querying the database';
        this.error = err;
    }
}

class CreateGroupError extends BusinessError {
    constructor() {
        super();
        this.message = 'Group not created';
    }
}

class GroupExistsError extends BusinessError {
    constructor(name) {
        super();
        this.message = 'Group already exists';
        this.name = name;
    }
}

class UserAlreadyInGroupError extends BusinessError {
    constructor(userid, groupid) {
        super();
        this.message = 'User already in group';
        this.userid = userid;
        this.groupid = groupid;
    }
}

class GroupNotFoundError extends BusinessError {
    constructor(groupid) {
        super();
        this.message = 'Group does not exist';
        this.id = groupid;
    }
}

class AddUserToGroupError extends BusinessError {
    constructor(userid, groupid) {
        super();
        this.message = 'Unable to add user to group';
        this.userid = userid;
        this.groupid = groupid;
    }
}

class UserNotInAGroupError extends BusinessError {
    constructor(userid) {
        super();
        this.message = 'User not in group';
        this.userid = userid;
    }
}

class CreatePostError extends BusinessError {
    constructor() {
        super();
        this.message = 'Post not created';
    }
}

class UserNotInGroupError extends BusinessError {
    constructor(userid, groupid) {
        super();
        this.message = 'User not in group';
        this.userid = userid;
        this.groupid = groupid;
    }
}

class PostNotFoundError extends BusinessError {
    constructor(postid) {
        super();
        this.message = 'Post does not exist';
        this.postid = postid;
    }
}

class CreateCommentError extends BusinessError {
    constructor() {
        super();
        this.message = 'Comment not created';
    }
}

class CommentNotFoundError extends BusinessError {
    constructor(commentid) {
        super();
        this.message = 'Comment does not exist';
        this.commentid = commentid;
        this.code = 500;
    }
}

class InvalidMediaTypeError extends BusinessError {
    constructor(mediatype) {
        super();
        this.message = 'Invalid media type';
        this.mediatype = mediatype;
    }
}

class UserHasAlreadyLikedError extends BusinessError {
    constructor(userid, mediatype, mediaid) {
        super();
        this.message = 'User has already liked';
        this.userid = userid;
        this.mediatype = mediatype;
        this.mediaid = mediaid;
    }
}

class CreateLikeError extends BusinessError {
    constructor() {
        super();
        this.message = 'Like not created';
    }
}

class UserNotFoundError extends BusinessError {
    constructor(userid) {
        super();
        this.message = 'User does not exist';
        this.userid = userid;
    }
}

class InvalidIdError extends BusinessError {
    constructor(id) {
        super();
        this.message = 'Invalid id';
        this.id = id;
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
    UserNotInAGroupError,
    CreatePostError,
    UserNotInGroupError,
    PostNotFoundError,
    CreateCommentError,
    CommentNotFoundError,
    InvalidMediaTypeError,
    UserHasAlreadyLikedError,
    CreateLikeError,
    UserNotFoundError,
    InvalidIdError,
};
