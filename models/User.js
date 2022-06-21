const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this only works on create and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not the same!'
        }
    }
})

userSchema.pre('save', async function (next) {
    //Only run his function if password was acually modified
    if (!this.isModified('password')) return next();

    //hash the password with coast of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field 
    this.passwordConfirm = undefined;
    next();
});

module.exports = mongoose.model('User', userSchema);