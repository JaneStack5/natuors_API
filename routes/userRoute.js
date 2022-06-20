const express = require("express");
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController")

const {
    signup
} = require('../controllers/authController')

const router = express.Router();

router.post('/signup', signup)

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;