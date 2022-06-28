const Review = require('./../models/Review')
const catchAsync = require('./../utils/catchAsync')
const { deleteOne } = require('./handlerFactory')

exports.createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId }
    const reviews = await  Review.find(filter);

    //SEND RESPONSE
    res.status(200).json({
        status: 'success',
        count: reviews.length,
        data: {
            reviews
        }
    })
});

exports.getReview = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const review = await Review.findById(id);

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})

exports.updateReview = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const review = await Review.findByIdAndUpdate( id, req.body, {
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new AppError('No review found with that ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})

exports.deleteReview = deleteOne(Review)