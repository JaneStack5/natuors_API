const express = require("express");
const {
    getTour,
    getAllTours,
    createTour,
    updateTour,
    deleteTour,
    checkID,
    checkbody
} = require("../controllers/tourControllers")
const router = express.Router();

router.param('id',  checkID)

router
    .route('/')
    .get(getAllTours)
    .post(checkbody, createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router;