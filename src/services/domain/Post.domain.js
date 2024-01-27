class Post {
    constructor(id, content, userid, groupid, postedOn) {
        this.id = id;
        this.content = content;
        this.userid = userid;
        this.group = groupid;
        this.postedOn = postedOn;
    }
}

module.exports = Post;
