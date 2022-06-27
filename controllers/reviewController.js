const Review = require('./../models/Review')
const catchAsync = require('./../utils/catchAsync')

exports.createReview = catchAsync(async (req, res, next) => {
    const { review, rating, createdAt, tour, user } = req.body
    const newReview = await Review.create({ review, rating, createdAt, tour, user })
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await  Review.find();

    //SEND RESPONSE
    res.status(200).json({
        status: 'success',
        count: reviews.length,
        data: {
            reviews
        }
    })
});