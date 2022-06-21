const User = require('./../models/User')
const catchAsync = require('./../utils/catchAsync')

exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, photo, password, passwordConfirm} = req.body ;
    const newUser = await User.create({name, email, photo, password, passwordConfirm});

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
})