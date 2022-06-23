const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('./../models/User')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const {name, email, photo, password, passwordConfirm, passwordChangedAt,
        role, passwordResetToken, passwordResetExpires} = req.body ;
    const newUser = await User.create({
        name, email, photo, password, passwordConfirm,
        passwordChangedAt, role, passwordResetToken, passwordResetExpires
    });

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

    // 2) verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return  next(
            new AppError('The user with this token no longer exist.', 401)
        )
    }

    // 4) check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }
    // // Grant access to protected route
    req.user = currentUser;
    next()
});

exports.restrictTO = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    }
}

exports.forgotPassword = catchAsync( async(req, res, next) => {
    // 1)Get user based on posted email
    const user = await User.findOne({ email: req.body.email});
    if (!user) {
        return next(new AppError('There is no user with this email address.', 404));
    }

    // 2) Generate the random rest toke
    const resetToken = await user.createPasswordResetToken();

    // console.log('Token', resetToken)

    await user.save( {validateBeforeSave: false});

    // 3) Send it to users email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;


    const data = {
        url: resetURL
    }

    try {

        await new Email(user, data).sendPasswordReset();

        res.status(200).json({
            status: 'Success',
            message: 'Token sent to email!'
        });
    } catch(e) {

        //console.log(e)

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save( {validateBeforeSave: false});

        return next(
            new AppError('There was an error sending the email, Try again later!', 500)
        )

    }
})

exports.forgotPassword = catchAsync( async(req, res, next) => {
    // 1)Get user based on posted email
    const { email} = req.body
    const user = await User.findOne({ email});
    if (!user) {
        return next(new AppError('There is no user with this email address.', 404));
    }

    // 2) Generate the random reset toke
    const resetToken = await user.createPasswordResetToken();
    await user.save( {validateBeforeSave: false});

    // 3) Send it to users email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new
    password and confirm to: ${resetURL}.\n If you didnt, Please ignore this email.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })
    } catch (err) {
       user.passwordResetToken = undefined;
       user.passwordResetExpires = undefined;
       await user.save( {validateBeforeSave: false});

       return next(
           new AppError('There was an error sending the email. Try again later!'),
           500
       );
    }
   
})

exports.resetPassword = (req, res, next) => {}