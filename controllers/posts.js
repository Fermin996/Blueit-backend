
const { json } = require('body-parser');
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user')


const getPosts = async(req,res,next) => {
    let page
    let start = req.params.start
    
    try{    
        if(req.params.op === "date"){
            page = await Post.find({}).skip(start).limit(4).sort({$natural:-1})
        }else if(req.params.op==="votes"){
            page = await Post.find({}).skip(start).limit(4).sort({"votes":-1, "date":-1})
        }
    }catch(err){
        console.log(err)
    }

    
    res.json({ page: page.map( post => post.toObject({getters: true})) })

}

const getPostsBySub = async(req, res, next) => {
    const currSub = req.params.subName;
    let page;

    try{    
        page = await Post.find({sub:currSub})
    }catch(err){
        console.log(err)
    }


    res.json({page})
}

const getPostById = async(req, res, next) => {
    const postId = req.params.pid
    let post;

    try{
        post = await Post.findById(postId)
    }catch(err){
        console.log(err)
    }


    res.json({post: post.toObject({getters:true})})

}

const getPostsByUser= async(req, res, next) => {
    const userId = req.params.uid
    let currUser; 

    try{
        currUser = await User.findById(userId).populate('posts')
    }catch(err){
        console.log(err)
    }

    res.json({currUser})
}



const createPost= async (req,res,next) => {
    const { user, title, text, sub, subName, comments, username} = req.body
    let outText
    if(!text){
        outText = " "
    }else{
        outText = text
    }

    const createdPost = new Post({
        title,
        text: outText,
        user,
        sub,
        votes:1,
        voteUsers:[{
            userVote:{
                user:user,
                voteType:"upVote"
            }
        }],
        comments,
        username,
        subName,
        date: Date()
    })

    let currUser;
    try{
        currUser = await User.findById(user)
    }catch(err){
        return "ERRRORRR"
    }

    try{
        await createdPost.save()
        currUser.posts.push(createdPost)
        currUser.karma+=1
        await currUser.save()

    }catch(err){
        return next(err)
    }
        
    res.status(201).json({post: createdPost})
}

const getPostsBySearch=async(req, res, next)=>{
    const string = req.params.string
    string.toLowerCase()
    let page 

    try{    
        page = await Post.find({}).sort({$natural:-1})
    }catch(err){
        console.log(err)
    }

    let newPage = page.filter((post) =>
        post.title.toLowerCase().includes(string) ||
        post.subName.toLowerCase().includes(string) ||
        post.text.toLowerCase().includes(string) ||
        post.username.toLowerCase().includes(string)
    )

    res.json(newPage)

}

const editPost = async(req, res, next) => {
    const postId = req.params.pid

    let post;

    try{
        post = await Post.findById(postId)
    }catch(err){
        console.log(err)
    }

    post.text = req.body.postText;

    try{
        await post.save()
    }catch(err){
        console.log(err)
    }

    res.status(201).json({ post: post.toObject({ getters: true }) })
    
}

const changeVotes = async(req, res, next)=>{
    const postId = req.params.pid
    let post
    let user

    console.log()

    try{
        post = await Post.findById(postId)
    }catch(err){
        console.log(err)
    }

    try{
        user = await User.findById(req.body.userId)
    }catch(err){
        console.log(err)
    }


    let voteType = req.body.voteType
    let voteUser = req.body.userId
    let voteId = req.body.voteId
    let foundIndex


    if(voteId){
        foundIndex = post.voteUsers.findIndex((v) => JSON.stringify(v._id) === `"${voteId}"`)
    }
    if(voteType === "upVote"){
        post.voteUsers.push({userVote: {user:voteUser, voteType}})
        post.votes+=1;
        user.karma+=1
    }else if(voteType === "downVote"){
        post.voteUsers.push({userVote: {user:voteUser, voteType}})
        post.votes-=1;
        user.karma-=1
    }else if(voteType === "upUnclicked"){
        post.voteUsers.splice(foundIndex, 1)
        post.votes-=1
        user.karma-=1
    }else if(voteType === "downUnclicked"){
        post.voteUsers.splice(foundIndex, 1)
        post.votes+=1
        user.karma+=1
    }else if(voteType === "dtoU"){
        let tempVote = post.voteUsers[foundIndex]
        tempVote.userVote.voteType = "upVote"
        post.votes+=2
        user.karma+=2
    }else if(voteType === "utoD"){
        let tempVote = post.voteUsers[foundIndex]
        tempVote.userVote.voteType = "downVote"
        post.votes-=2
        user.karma-=2
    }

    try {
        await user.save()
    } catch (error) {
        console.log(error)
    }

    try{
        await post.save()
    } catch(err){
        console.log(err)
    }

    res.status(201).json({ item: post.toObject({ getters: true }) })

}

const deletePost= async(req, res, next)=>{
    const postId = req.params.pid
    let post;

    try{
        post = await Post.findById(postId)
    }catch(err){
        console.log(err)
    }

    try{
        await post.remove()
    }catch(err){
        console.log(err)
    }

    res.status(200).json({ message:"post deleted" })

}

exports.getPostsBySub = getPostsBySub;
exports.getPostsByUser = getPostsByUser;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.editPost = editPost;
exports.deletePost = deletePost;
exports.getPosts = getPosts;
exports.changeVotes = changeVotes;
exports.getPostsBySearch = getPostsBySearch