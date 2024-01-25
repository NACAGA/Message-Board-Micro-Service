const groupService = require('../services/group.service');
const userService = require('../services/user.service');

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

module.exports = {
    createGroup,
    addUser,
    getGroups,
    getUsers,
    getUserGroups,
};
