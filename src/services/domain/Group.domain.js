class Group {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.dateCreated = new Date();
    }
}

module.exports = Group;
