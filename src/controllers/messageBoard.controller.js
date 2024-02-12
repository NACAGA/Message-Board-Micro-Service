const groupService = require('../services/group.service');
const userService = require('../services/user.service');
const postService = require('../services/post.service');
const commentService = require('../services/comment.service');
const likeService = require('../services/like.service');

async function getPostById(req, res, next) {
    try {
        let response = await postService.getPostById(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting post: ', err);
        next(err);
    }
}

async function getPostsByUserId(req, res, next) {
    try {
        let response = await postService.getPostsByUserId(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting post: ', err);
        next(err);
    }
}

async function getPostsByGroupId(req, res, next) {
    try {
        let response = await postService.getPostsByGroupId(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting post: ', err);
        next(err);
    }
}

async function getPostsByDate(req, res, next) {
    try {
        let response = await postService.getPostsByDate(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting post: ', err);
        next(err);
    }
}

async function getGroups(req, res, next) {
    try {
        let response = await groupService.getGroups(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting groups: ', err);
        next(err);
    }
}

async function getUsers(req, res, next) {
    try {
        let response = await userService.getUsers(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting users: ', err);
        next(err);
    }
}

async function getUserGroups(req, res, next) {
    try {
        let response = await groupService.getUserGroups(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting user groups: ', err);
        next(err);
    }
}

async function getCommentById(req, res, next) {
    try {
        let response = await commentService.getCommentById(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting comments: ', err);
        next(err);
    }
}

async function getPostComments(req, res, next) {
    try {
        let response = await commentService.getPostComments(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting post comments: ', err);
        next(err);
    }
}

async function getUserComments(req, res, next) {
    try {
        let response = await commentService.getUserComments(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while getting user comments: ', err);
        next(err);
    }
}

async function createGroup(req, res, next) {
    try {
        let response = await groupService.createGroup(req.body);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while creating group: ', err);
        next(err);
    }
}

async function addUser(req, res, next) {
    try {
        let response = await userService.addUser(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while adding user to group: ', err);
        next(err);
    }
}

async function createPost(req, res, next) {
    try {
        let response = await postService.createPost(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while creating post: ', err);
        next(err);
    }
}

async function createComment(req, res, next) {
    try {
        let response = await commentService.createComment(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while creating comment: ', err);
        next(err);
    }
}

async function createLike(req, res, next) {
    try {
        let response = await likeService.createLike(req);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while creating like: ', err);
        next(err);
    }
}

module.exports = {
    createGroup,
    addUser,
    getGroups,
    getUsers,
    getUserGroups,
    createPost,
    createComment,
    getCommentById,
    getUserComments,
    getPostComments,
    createLike,
    getPostById,
    getPostsByUserId,
    getPostsByGroupId,
    getPostsByDate,
};
