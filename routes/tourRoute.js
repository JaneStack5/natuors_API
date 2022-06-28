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
const reviewRouter = require('./../routes/reviewRoute')

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter)

//router.param('id',  checkID)
router.route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)
router.route( protect, restrictTO('admin', 'lead-guide', 'guide'), '/monthly-plan/:year').get(getMonthlyPlan)

router
    .route('/')
    .get( getAllTours )
    .post( protect, restrictTO('admin', 'lead-guide'), createTour)

router
    .route('/:id')
    .get(getTour)
    .patch( protect, restrictTO('admin', 'lead-guide'), updateTour )
    .delete(protect, restrictTO('admin', 'lead-guide'), deleteTour)

module.exports = router;