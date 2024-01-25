const groupService = require('../services/group.service');
const userService = require('../services/user.service');

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
};
