const express = require("express");
const {
    getAllReviews,
    createReview,
    deleteReview,
    getReview,
    updateReview
} = require('./../controllers/reviewController')

const {
    protect,
    restrictTO
} = require('../controllers/authController')
const router = express.Router({ mergeParams: true });

router.use(protect)

router
    .route('/')
    .get(getAllReviews)
    .post( restrictTO('user'), createReview)

router.route('/:id')
    .get(getReview)
    .patch( restrictTO('user', 'admin'),updateReview)
    .delete( restrictTO('user', 'admin'), deleteReview)


module.exports = router;