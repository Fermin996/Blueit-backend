const { text } = require("body-parser")
const mongoose = require("mongoose")
const Comment = require("../models/comments")
const User = require("../models/user")
const Post = require("../models/post")

const createComment = async(req, res, next) => {

    const { text, user, post, parentComment, username } = req.body
    const createdComment = new Comment({
        text,
        user,
        userName:username,
        post,
        comments:[],
        voteUsers:[{
            userVote:{
                user:user,
                voteType:"upVote"
            }
        }],
        votes:1,
        parentComment,
        date: Date()
    })

    let currUser;
    let currParent;

    try{
        if(parentComment){
            currParent = await Comment.findById(parentComment)
        }else{
            currParent = await Post.findById(post)
        }

        currUser = await User.findById(user)
        
    }catch(err){
        console.log(err)
    }

    try{
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdComment.save({ session: sess })
        currUser.comments.push(createdComment)
        currParent.comments.push(createdComment)
        await currParent.save({session: sess})

        await currUser.save({session: sess})
        await sess.commitTransaction()
    }catch(err){
        return next(err)
    }

    res.status(201).json({comment: createdComment})

}

const getCommentsByParent = async (req,res,next)=>{

    const currParent = req.params.pid
    let comments

    try{
        comments = await Comment.findById(currParent).populate('comments')
    }catch(err){
        console.log(err)
    }

    res.json(comments.comments)

}

const getCommentById = async(req, res, next)=>{

    let commentId = req.params.cId

    let comment
    try{
        comment = await Comment.findById(commentId)
    }catch(err){
        console.log(err)
    }

    res.json({comment})
}

const getCommentsByPost = async (req,res,next)=>{

    const currPost = req.params.pid
    let comments

    try{
        comments = await Post.findById(currPost).populate('comments')
    }catch(err){
        console.log(err)
    }

    res.json(comments.comments)

}

const getCommentByUser = async (req,res,next)=>{
    const userId = req.params.uid

    let comments
    try{
        comments = await User.findById(userId).populate('comments')
    }catch(err){
        console.log(err)
    }
    res.json(comments)
}

const changeCommentVotes = async(req, res, next)=>{
    const commentId = req.params.cid
    let comment

    try{
        comment = await Comment.findById(commentId)
    }catch(err){
        console.log(err)
    }

    let voteType = req.body.voteType
    let voteUser = req.body.userId
    let voteId = req.body.voteId
    let foundIndex

    if(voteId){
        foundIndex = comment.voteUsers.findIndex((v) => JSON.stringify(v._id) === `"${voteId}"`)
    }
    if(voteType === "upVote"){
        comment.voteUsers.push({userVote: {user:voteUser, voteType}})
        comment.votes+=1;
    }else if(voteType === "downVote"){
        comment.voteUsers.push({userVote: {user:voteUser, voteType}})
        comment.votes-=1;
    }else if(voteType === "upUnclicked"){
        comment.voteUsers.splice(foundIndex, 1)
        comment.votes-=1
    }else if(voteType === "downUnclicked"){
        comment.voteUsers.splice(foundIndex, 1)
        comment.votes+=1
    }else if(voteType === "dtoU"){
        let tempVote = comment.voteUsers[foundIndex]
        tempVote.userVote.voteType = "upVote"
        comment.votes+=2
    }else if(voteType === "utoD"){
        let tempVote = comment.voteUsers[foundIndex]
        tempVote.userVote.voteType = "downVote"
        comment.votes-=2
    }

    try{
        await comment.save()
    } catch(err){
        console.log(err)
    }

    res.status(201).json({ item: comment.toObject({ getters: true }) })
}

const editComment = async(req,res,next)=>{
    const commentId = req.params.cid

    let comment;

    try{
        comment = await Comment.findById(commentId)
    }catch(err){
        console.log(err)
    }

    comment.text = req.body.text;

    try{
        await comment.save()
    }catch(err){
        console.log(err)
    }

    res.status(201).json({ comment: comment.toObject({ getters: true }) })
}

const deleteComment = async(req,res,next)=>{
    let commentId = req.params.cid
    let comment
    try{    
        comment = await Comment.findById(commentId)   

    }catch(err){
        console.log(err)
    }

    try{
        await comment.remove()
    }catch(err){
        console.log(err)
    }

    res.status(200).json({ message:"comment deleted" })

}

exports.getCommentById = getCommentById
exports.createComment = createComment;
exports.getCommentsByParent = getCommentsByParent;
exports.getCommentsByPost = getCommentsByPost;
exports.getCommentByUser = getCommentByUser;
exports.changeCommentVotes = changeCommentVotes;
exports.editComment = editComment;
exports.deleteComment = deleteComment;
