const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    Constants = require('../../config/constants');

let User = mongoose.model('User'),
    Submission = mongoose.model('Submission');

exports.create = function (req, res) {
    let user = new User(req.body);
    user.save()
        .then(userDetails => {
            res.json({userID: userDetails._id});
        })
        .catch(err => {
            res.status(400).json(err);
        })
};

exports.authenticate = function (req, res) {
    User.findOne({email: req.body.email})
        .then(userinstance => {
            if (!userinstance) {
                res.status(400).send({error: Constants.APP_MESSAGE.INCORRECT_EMAIL_ERROR});
            }
            else if (bcrypt.compareSync(req.body.password, userinstance.password)) {
                const token = jwt.sign(
                    {
                        id: userinstance._id,
                    },
                    req.app.get(Constants.SERVER.APP_SECRET_KEY),
                    {expiresIn: Constants.SERVER.JWT_DISCARD_TIME});
                res.send({userEmail: userinstance.email, payload: {token: token}});
            }
            else {
                res.json({err : "Incorrect Password"});
            }
        })
        .catch(err => {
            res.status(400).json(err);
        })

};

exports.getStats = function (req, res) {
    try {
        let {userId} = req.body;
        console.log({userId})
        Submission.find({
            createdBy: userId
        }, {
            quizId: 1,
            totalPointsSecured: 1,
            completionPercentage: 1
        })
            .then(async submissions => {
                let [averageCompletionRate, averagePoints] = await Promise.all(
                    [getAverage(submissions, 'completionPercentage'),
                        getAverage(submissions, 'totalPointsSecured')])

                return res.json({
                    submissions,
                    totalQuizAttempts: submissions.length,
                    averageCompletionRate,
                    averagePoints});
            })
            .catch(err => {
                return res.json({err});
            })
    } catch (err) {
        console.error({err})
        return res.json({err: "Error while fetching stats"});
    }
}

function getAverage(submissions, property) {
    let points = 0;
    return new Promise((resolve, reject) => {
        try{
            submissions.forEach(submission => {
                points += submission[property] || 0
            })
            resolve(points / submissions.length);
        } catch (e) {
            console.error({e})
            reject(e)
        }
    })
}
