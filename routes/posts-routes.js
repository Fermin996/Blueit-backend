const { application } = require("express");
const express = require('express')

const postsControllers = require("../controllers/posts.js")
const checkAuth = require('../auth/check-auth')

const router = express.Router();

router.get('/sort/:op/:start', postsControllers.getPosts)
router.get('/sub/:subName', postsControllers.getPostsBySub)
router.get('/user/:uid', postsControllers.getPostsByUser)
router.get('/:pid', postsControllers.getPostById)
router.get('/search/:string', postsControllers.getPostsBySearch)

//router.use(checkAuth);

router.patch('/:pid', postsControllers.editPost)
router.patch('/votes/:pid', postsControllers.changeVotes)

router.post('/', postsControllers.createPost)

router.delete('/:pid', postsControllers.deletePost)

module.exports = router;