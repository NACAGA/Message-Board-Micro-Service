const express = require('express');
const router = express.Router();
const { body, header, param } = require('express-validator');
const messageBoardController = require('../controllers/messageBoard.controller');

const validateUrlParameters = (expectedFields) => {
    return (req, res, next) => {
        const missingParams = expectedFields.filter((field) => !(field in req.params));

        if (missingParams.length > 0) {
            return res.status(400).json({
                message: `Missing parameters: ${missingParams.join(', ')}`,
            });
        }
        next();
    };
};

const validateRequestBody = (expectedFields) => {
    return (req, res, next) => {
        const missingFields = expectedFields.filter((field) => !(field in req.body));

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing fields: ${missingFields.join(', ')}`,
            });
        }
        next();
    };
};

validateRequestHeaders = (expectedFields) => {
    return (req, res, next) => {
        const missingFields = expectedFields.filter((field) => !(field in req.headers));

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing fields: ${missingFields.join(', ')}`,
            });
        }
        next();
    };
};

router.get('/', (req, res) => {
    res.json({
        message: 'Hello World!',
    });
});

router.get('/group', messageBoardController.getGroups);

router.get('/group/:groupid', messageBoardController.getGroups);

router.get('/user/:groupid', messageBoardController.getUsers);

router.get('/user-groups/:userid', messageBoardController.getUserGroups);

//router.get('/user/:userid', messageBoardController.getUsers);

router.post(
    '/group',
    [validateRequestBody(['name', 'description']), body('name').isString(), body('description').isString()],
    messageBoardController.createGroup
);

/**
 * POST add a user to a group
 */
router.post(
    '/user/:userid/:groupid',
    [validateUrlParameters(['userid', 'groupid']), param('userid').isInt(), param('groupid').isInt()],
    messageBoardController.addUser
);

module.exports = router;
