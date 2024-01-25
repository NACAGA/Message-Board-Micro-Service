const createGroupService = require('../services/createGroup.service');

async function createGroup(req, res, next) {
    try {
        let response = await createGroupService.createGroup(req.body);
        response = response.getResponse();
        res.status(response.status).json(response.body);
    } catch (err) {
        console.error('Error while creating group: ', err);
        next(err);
    }
}

module.exports = {
    createGroup,
};
