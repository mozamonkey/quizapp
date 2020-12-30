require('dotenv').config();
let express = require('express'),
    app = express(),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    User = require('./api/models/user.js'),
    Quiz = require('./api/models/quiz.js'),
    Submission = require('./api/models/submission.js'),
    Constants = require('./config/constants'),
    port = process.env.PORT || Constants.SERVER.PORTS.EXPRESS;

mongoose.connect(process.env.DB_HOST || 'mongodb://localhost/quizApp', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
});

app.use(morgan(Constants.env.DEV));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set(Constants.SERVER.APP_SECRET_KEY, Constants.SERVER.JWT_KEY);

let routes = require('./routes/routes.js');
routes(app);

app.use(function (req, res) {
    res.status(404).send({url: req.originalUrl + Constants.APP_MESSAGE.NOT_FOUND_ERROR})
});

app.listen(port);

console.log('Quiz API server started on: ' + port);
