// Util folder
const Group = require('../services/domain/Group.domain');
const User = require('../services/domain/User.domain');

function convertGroup(group) {
    return new Group(group.id, group.name, group.description, group.created_at);
}

function convertUserGroup(group) {
    return new UserGroup(group.id, group.name, group.description, group.created_at, group.joined_on);
}

function convertUser(user) {
    return new User(user.id);
}

module.exports = { convertGroup, convertUser, convertUserGroup };
