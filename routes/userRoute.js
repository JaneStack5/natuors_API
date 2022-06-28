const express = require("express");
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteme,
    getMe
} = require("../controllers/userController")

const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTO
} = require('../controllers/authController')

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login )
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

//To use the protect middleware without repeating yourself
router.use(protect)

router.patch('/updateMyPassword', updatePassword)

router.get('/me', getMe)
router.patch('/updateMe', updateMe)
router.delete('/deleteMe', deleteme)

router.use(restrictTO('admin'))

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