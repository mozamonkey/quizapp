exports.env = {
    DEV: 'dev',
    LIVE: 'live',
    LOCAL: 'local'
};

exports.SERVER = {
    env: 'env',
    PORTS: {
        EXPRESS: 8080
    },
    JWT_DISCARD_TIME: '24h',
    APP_SECRET_KEY: process.env.APP_KEY || "someDefaultValueAPPKEY",
    JWT_KEY: process.env.JWTVAL || "someDefaultValueJWTValue"
};

exports.APP_MESSAGE = {
    INCORRECT_EMAIL_ERROR: ' This email ID is not registered with us.',
    JWT_DISCARD_MESSAGE: ' The user has been successfully logged out',
    REAUTHENTICATE_MESSAGE: ' The user has been logged out, kindly reauthenticate',
    NOT_FOUND_ERROR: ' Error 404: Page not found'
}
