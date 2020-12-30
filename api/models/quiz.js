const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    QuizSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        idealTime: {
            type: Number
        },
        createdBy: {
            type: String,
            required: true
        },
        course: [
            {
                question: {
                    type: String,
                    required: true,
                    validate: {
                        validator: function (v){
                            return (!!v) //ensures question is not a falsey value like null or ""
                        },
                        message: que => `${que.value} is not a valid question!`
                    }
                },
                answer: {
                    type: String,
                    required: true,
                    validate: {
                        validator: function (v){
                            return (!!v) //ensures answer is not a falsey value like null or ""
                        },
                        message: ans => `${ans.value} is not a valid answer!`
                    }
                },
                points: {
                    type: Number
                }
            }
        ]
    }, {
        timestamps: true,
    });

module.exports = mongoose.model('Quiz', QuizSchema);
