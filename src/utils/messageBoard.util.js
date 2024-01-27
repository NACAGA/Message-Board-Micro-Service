// Util folder
const Group = require('../services/domain/Group.domain');
const User = require('../services/domain/User.domain');
const Post = require('../services/domain/Post.domain');

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

module.exports = { convertGroup, convertUser, convertUserGroup, convertPost };
