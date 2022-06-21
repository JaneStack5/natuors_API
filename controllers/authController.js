const jwt = require('jsonwebtoken')
const User = require('./../models/User')
const catchAsync = require('./../utils/catchAsync')

exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, photo, password, passwordConfirm} = req.body ;
    const newUser = await User.create({name, email, photo, password, passwordConfirm});

    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRES_IN
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})