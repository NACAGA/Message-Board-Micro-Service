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

/**
 * GET all groups
 */
router.get('/group', messageBoardController.getGroups);

/**
 * GET gropup by groupid
 */
router.get('/group/:groupid', messageBoardController.getGroups);

/**
 * GET all users in a group
 */
router.get('/user/:groupid', messageBoardController.getUsers);

/**
 * GET all groups a user is in
 */
router.get('/user/groups/:userid', messageBoardController.getUserGroups);

/**
 * GET comment by id
 */
router.get('/comment/:commentid', messageBoardController.getCommentById);

/**
 * GET all comments on a post
 */
router.get('/comment/post/:postid', messageBoardController.getPostComments);

/**
 * GET all comments by a user
 */
router.get('/comment/user/:userid', messageBoardController.getUserComments);

/**
 * GET post
 * GET all posts in a group
 * GET all posts by a user
 * GET all posts :days days back
 */
router.get('/post/:postid', [validateUrlParameters(['postid']), param('postid').isInt()], messageBoardController.getPostById);

router.get('/post/user/:userid', [validateUrlParameters(['userid']), param('userid').isInt()], messageBoardController.getPostsByUserId);

router.get(
    '/post/group/:groupid',
    [validateUrlParameters(['groupid']), param('groupid').isInt()],
    messageBoardController.getPostsByGroupId
);

router.get('/post/date/:days', [validateUrlParameters(['days']), param('days').isInt()], messageBoardController.getPostsByDate);

/**
 * POST create a group
 */
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

/**
 * POST create a post
 */
router.post(
    '/post/:userid/:groupid',
    [
        validateUrlParameters(['userid', 'groupid']),
        validateRequestBody(['content']),
        param('userid').isInt(),
        param('groupid').isInt(),
        body('content').isString(),
    ],
    messageBoardController.createPost
);

/**
 * POST create a comment
 */
router.post(
    '/comment/:userid/:postid',
    [
        validateUrlParameters(['userid', 'postid']),
        validateRequestBody(['content']),
        param('userid').isInt(),
        param('postid').isInt(),
        body('content').isString(),
    ],
    messageBoardController.createComment
);

/**
 * POST create a like
 */
router.post(
    '/like/:userid/:mediatype/:mediaid',
    [
        validateUrlParameters(['userid', 'mediatype', 'mediaid']),
        param('userid').isInt(),
        //() => param('mediatype') === 'post' || param('mediatype') === 'comment',
        param('mediaid').isInt(),
    ],
    messageBoardController.createLike
);
module.exports = router;
