const express = require('express');
const checkAuth = require('../auth/check-auth');

const userControllers = require('../controllers/users');
const router = express.Router()

router.get('/:uid', userControllers.getUserById)
router.get('/save/:uId', userControllers.getSavedItems)
router.patch('/save/:uId', userControllers.saveItem)
router.patch('/delete-saved/:uId', userControllers.unsaveItem)
router.patch("/bio-edit/:uId", userControllers.bioEdit)

router.post('/signup', userControllers.signup)
//router.use(checkAuth)
router.post('/login', userControllers.login)



module.exports = router;