const router = require('express').Router();
const validateUser = require('./validateUser');
const userController = require('../api/controllers/usercontroller');

router.post('/create', userController.create);

router.post('/login', userController.authenticate);

router.get('/stats', validateUser, userController.getStats);

router.post
module.exports = router;
