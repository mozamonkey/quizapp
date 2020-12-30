const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    SubmissionSchema = new Schema({
        quizId: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true
        },
        submittedAnswers: [
            {
                questionId: {
                    type: String,
                    required: true
                },
                answerProvided: {
                    type: String,
                    default: "UNANSWERED"
                },
                answerStatus: {
                    type: String,
                    enum: ['CORRECT', 'INCORRECT'],
                    required: true
                }
            }
        ],
        totalPointsSecured: {
            type: Number
        },
        percentScore: {
            type: Number
        },
        completionPercentage: {
            type: Number
        }
    }, {
        timestamps: true,
    });

module.exports = mongoose.model('Submission', SubmissionSchema);
