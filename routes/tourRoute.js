const express = require("express");
const {
    getTour,
    getAllTours,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
} = require("../controllers/tourControllers")
const { protect, restrictTO} = require('./../controllers/authController')

const {
    createReview
} = require('../controllers/reviewController')

const router = express.Router();

//router.param('id',  checkID)
router.route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router
    .route('/')
    .get(protect, getAllTours)
    .post(createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(protect, restrictTO('admin', 'lead-guide'), deleteTour)

router.route('/:id/reviews')
    .post(protect, restrictTO('user'), createReview)

module.exports = router;