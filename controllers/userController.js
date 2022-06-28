const User = require('./../models/User')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
//const { deleteOne } = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    });
    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users   = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1)Create error if user Posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password update. Please use /updateMyPassword', 400)
        )
    }

    // 2) Filtered out unwanted fields names not allowed to be updated
    const filteredBody= filterObj(req.body, 'name', 'email')
   // if(req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})

exports.deleteme = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false});

    res.status(204).json({
        status: 'Success',
        data: null
    });
});

exports.getUser = (req, res,) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

exports.createUser = (req, res,) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

exports.updateUser = (req, res,) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

//exports.deleteUser = deleteOne(User)
exports.deleteUser = catchAsync(async(req, res,) => {
    const user = await User.findByIdAndDelete(req.params.id)

    res.status(204).json({
        status: 'success',
        message: null
    })
})
