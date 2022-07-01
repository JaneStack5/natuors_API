const express = require("express");
const { protect, restrictTO} = require('./../controllers/authController')
const {
    getCheckoutSession,
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    deleteBooking
} = require('./../controllers/bookingController')

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession)

//router.use(restrictTO('admin', 'lead-guide'))

router
    .route('/')
    .get(getAllBookings)
    .post(createBooking)

router
    .route('/:id')
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleteBooking)

module.exports = router;