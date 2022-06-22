const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('./../models/User')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, photo, password, passwordConfirm} = req.body ;
    const newUser = await User.create({name, email, photo, password, passwordConfirm});

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) { 
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) check if user exists && password is correct
    const user = await User.findOne({ email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('incorrect email or password', 401))
    }

    // 3) if everything is ok, send token to client
    //createSendToken(user, 202, req,res)
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check its existence
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access', 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // // 2) verification of token
    // console.log(jwt.verify)
    // console.log(token)
    // console.log(process.env.JWT_SECRET)
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  console.log(decoded)

    // // 3) check if user still exist
    // const freshUser = await User.findById(decoded.id);
    // if(!freshUser) {
    //     return  next(
    //         new AppError('The user with this token no longer exist.', 401)
    //     )
    // }

    // // 4) check if user changed password after token was issued
    // if (freshUser.changedPasswordAfter(decoded.iat)) {
    //     return next(
    //         new AppError('User recently changed password! Please log in again.', 401)
    //     );
    // }
    // // Grant access to protected route
    // req.user = freshUser;

    next()
});