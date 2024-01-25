const User = require('./User.domain');

class UserGroup extends Group {
    constructor(id, name, description, dateCreated, joinedOn) {
        super(id, name, description, dateCreated);
        this.joinedOn = joinedOn;
    }
}

module.exports = UserGroup;
