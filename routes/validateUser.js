const jwt = require('jsonwebtoken');
const Constants = require('../config/constants');

const validateUser = (req, res, next) => {
    let tokenID = req.headers['x-access-token'];
    jwt.verify(tokenID, res.app.get(Constants.SERVER.APP_SECRET_KEY), (err, decoded) => {
        if (err) {
            res.json(
                {
                    status: 'error',
                    err: err,
                    message: err.message,
                    resolve: Constants.APP_MESSAGE.REAUTHENTICATE_MESSAGE
                }
            );
        } else {
            req.body.userId = decoded.id;
            next();
        }
    });
};

module.exports = validateUser;
