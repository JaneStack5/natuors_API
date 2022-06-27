const express = require("express");
const {
    getAllReviews,
    createReview
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

module.exports = router;