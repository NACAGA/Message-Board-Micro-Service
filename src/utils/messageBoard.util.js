// Util folder
const Group = require('../services/domain/Group');

function convertGroup(group) {
    return new Group(group.id, group.name, group.description, group.created_at);
}

module.exports = { convertGroup };
