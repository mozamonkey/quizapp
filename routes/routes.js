const userController = require('../api/controllers/usercontroller'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    Constants = require('../config/constants');

const quizRouter = require('./quizRouter');
const userRouter = require('./userRouter');


module.exports = function (app) {

    app.use('/quiz', quizRouter);

    app.use('/user', userRouter);

};
