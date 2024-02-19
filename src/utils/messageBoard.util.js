// Util folder
const Group = require('../services/domain/Group.domain');
const User = require('../services/domain/User.domain');
const Post = require('../services/domain/Post.domain');
const Comment = require('../services/domain/Comment.domain');

function convertGroup(group) {
    return new Group(group.id, group.name, group.description, group.created_at);
}

function convertUserGroup(group) {
    return new UserGroup(group.id, group.name, group.description, group.created_at, group.joined_on);
}

function convertUser(user) {
    return new User(user.id);
}

function convertPost(post) {
    return new Post(post.id, post.content, post.user_id, post.group_id, post.created_at);
}

function convertComment(comment) {
    return new Comment(comment.id, comment.content, comment.user_id, comment.post_id, comment.created_at);
}

/**
 * Parses the id into an integer
 * @param {string} originalId 
 * @returns  integer id or Error.InvalidIdError
 */
async function parseId(originalId) {
    const id = parseInt(originalId);
    if (isNaN(id) || !Number(originalId)) {
        return new Error.InvalidIdError(id);
    }
    return id;
}


module.exports = { convertGroup, convertUser, convertUserGroup, convertPost, convertComment, parseId };
