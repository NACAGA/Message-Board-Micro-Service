const express = require('express');
const router = express.Router();
const { body, header } = require('express-validator');
const messageBoardController = require('../controllers/messageBoard.controller');

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

router.post(
    '/new-group',
    [validateRequestBody(['name', 'description']), body('name').isString(), body('description').isString()],
    messageBoardController.createGroup
);

module.exports = router;
