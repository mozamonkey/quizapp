const router = require('express').Router();
const validateUser = require('./validateUser');
const quizController = require('../api/controllers/quizController');

router.post('/create', validateUser, quizController.create);

router.get('/getQuizList', validateUser, quizController.getQuizzes);

router.get('/getQuizToAttempt', validateUser, quizController.getQuizQuestions);

router.post('/attemptQuiz', validateUser, quizController.attemptQuiz);

module.exports = router;
