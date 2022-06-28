const express = require("express");
const {
    getAllReviews,
    createReview,
    deleteReview
} = require('./../controllers/reviewController')

const {
    protect,
    restrictTO
} = require('../controllers/authController')
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTO('user'), createReview)

router.route('/:id').delete(deleteReview)

module.exports = router;