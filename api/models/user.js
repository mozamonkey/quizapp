const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    saltRounds = 12,
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    UserSchema = new Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            default: null
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        password: {
            type: String, //bcrypt value
            required: true
        },
    }, {
        timestamps: true,
    });

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

module.exports = mongoose.model('User', UserSchema);
