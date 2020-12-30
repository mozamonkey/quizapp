const mongoose = require('mongoose'),
    Quiz = mongoose.model('Quiz'),
    Submission = mongoose.model('Submission');

const _ = require('lodash')

/**
 * Create a new quiz.
 * @param req
 * if quiz body contains no questions then throws an error
 */
exports.create = function (req, res) {
    let quiz = new Quiz(req.body);
    quiz.createdBy = req.body.userId;
    if(!quiz.course || !Array.isArray(quiz.course) || (quiz.course?.length < 1)) {
        return res.json({
            err: "Quiz must contain at least 1 question"
        })
    }
    quiz.save()
        .then(quizDetails => {
            res.json({quizID: quizDetails._id});
        })
        .catch(err => {
            res.json(err);
        })
};

/**
 * Returns a list of quizzes to allow user to choose a quiz to attempt (without questions and answers)
 */
exports.getQuizzes = function (req, res) {
    Quiz.find({}, {_id: 1, name: 1, createdAt: 1})
        .then(quizzes => {
            return res.json({
                quizzes
            })
        })
        .catch(err => {
            return res.json({err})
        })
};

/**
  Returns a quiz without answers.
 @param req: expects a quizId in req.body
 */
exports.getQuizQuestions = function (req, res) {
    let {quizId} = req.query;
    Quiz.find({_id: quizId})
        .select({'course.answer' : 0})
        .then(quiz => {
            return res.json({
                quiz
            })
        })
        .catch(err => {
            return res.json({err})
        })
};

/**
 * Make a submission to a quiz
 * @param req: a quiz ID is expected
 * Throws an err if quiz id not present.
 */
exports.attemptQuiz = async function (req, res) {
    let submission = new Submission(req.body);
    if(!submission.quizId){
        return res.json({err: "quizId not specified"})
    }
    submission.createdBy = req.body.userId;
    try {
        const {quizId} = req.body;
        const quizDetails = await Quiz.findById(quizId);

        [submission.totalPointsSecured, submission.completionPercentage] = await
            Promise.all([
                rateSubmission(quizDetails, submission),
                getCompletion(quizDetails, submission),
            ]);

        submission.percentScore = await getPercentScore(quizDetails, submission.totalPointsSecured);

        submission.save()
            .then(submissionDetails => {
                res.json({
                    status: "Your submission was successful!",
                    submissionID: submissionDetails._id,
                    submissionTime: submissionDetails.createdAt,
                    pointsObtained: submissionDetails.totalPointsSecured,
                    scorePercentage: submissionDetails.percentScore,
                    completionPercentage: submissionDetails.completionPercentage,
                    answerStatus: submissionDetails.submittedAnswers
                });
            })
            .catch(err => {
                throw err
            })
    } catch (err) {
        return res.json({status: "Your submission was not accepted.", err});
    }
}

/**
 * Returns the points of the submission.
 * Matches answers irrespective of the case.
 */
async function rateSubmission(quizDetails, submission){
    const predefinedCourse = quizDetails.course;
    const answerSheet = submission.submittedAnswers;
    return new Promise((resolve, reject) => {
        try{
            let points = 0;
            answerSheet.forEach(questionEntry => {
                let predefinedAnswer = _.find(predefinedCourse, ['_id', mongoose.Types.ObjectId(questionEntry.questionId)])
                if (predefinedAnswer.answer.toString().toLowerCase() === questionEntry.answerProvided.toString().toLowerCase()) {
                    questionEntry.answerStatus = 'CORRECT'
                    points += (Number.isFinite(predefinedAnswer.points))?predefinedAnswer.points:0;
                } else {
                    questionEntry.answerStatus = 'INCORRECT'
                }
            })
            resolve(points);
        } catch (e) {
            console.error({e})
            reject(e)
        }
        }
    )
}

/**
 * Calculate percentage completion of quiz
 * @param quizDetails
 * @param submission
 * @returns a promise which resolves to the percent completion.
 */
async function getCompletion (quizDetails, submission) {
    const predefinedCourse = quizDetails.course;
    const answerSheet = submission.submittedAnswers;
    return new Promise(((resolve, reject) => {
        try {
            resolve((answerSheet.length / predefinedCourse.length) * 100);
        } catch (e) {
            reject("Error while calculating completion score");
        }
    }))
}


async function getPercentScore(quiz, totalPointsSecured) {
    let points = 0;
    return new Promise(((resolve, reject) => {
        try {
            quiz.course.forEach(entry => {
                points += entry.points || 0;
            })
            resolve((totalPointsSecured/points)*100);
        } catch (e) {
            reject("Error while calculating percent score");
        }
    }))
}
