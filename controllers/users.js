const User = require('../models/user')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const  validateRegistration = require('../validation/validateRegistration')

const signup = async (req, res, next)=>{
    const { username, email, password } = req.body
    let userExists;

    let errors = validateRegistration(req.body, false)
    
    if(errors.errors){
        return res.status(400).json(errors)
    }
    

    try{
        userExists = await User.findOne({ email: email})
    }catch(err){
        console.log(err)
    }

    if(userExists){
        return res.status(400).json({email: "User already exists"})
    }

    let hashedPass;

    try{
        hashedPass = await bcrypt.hash(password, 12);
    }catch(err){
        console.log(err)
    }

   

    const createdUser = new User({
        username,
        email,
        bio:" ",
        karma: 0,
        password: hashedPass,
        posts:[],
        saved:{
            savedPosts:[],
            savedComments:[]
        },
        cakeDay: Date()
    })

    try{
        await createdUser.save()
    }catch(err){
        console.log(err)
    }

    let token;
    token = jwt.sign({userId:createdUser.id}, 'willo-whisper')

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token, username:createdUser.username, saved:createdUser.saved});

}

const login = async (req, res, next) => {
    if(req.body.token){
        const decodedToken = jwt.verify(req.body.token, 'willo-whisper')
        return res.json({ userName:req.body.username, userId: req.body.id, email: req.body.email, saved:req.body.saved, token: req.body.token })
    }

    let errors = validateRegistration(req.body, true)

    if(errors.errors){
        return res.status(400).json(errors)
    }

    const { email, password } = req.body
    let userExists;

    try{
        userExists = await User.findOne({email: email})
    }catch(err){
        return res.status(400).json({email: "User does not exist"})
    }

    let isValidPass = false;

    try{
        isValidPass = await bcrypt.compare(password, userExists.password)
    }catch(err){
        console.log(err)
    }
    
    if(!isValidPass){
        return 
    }

    let token;
    token = jwt.sign({userId: userExists.id}, 'willo-whisper')
    res.json({ username: userExists.username, userId: userExists.id, saved:userExists.saved, email: userExists.email, token:token })

}

const getUserById = async (req,res, next) =>{

    const currUid = req.params.uid
    let user;
    try{    
        user = await User.findById(currUid)
    }catch(err){
        console.log(err)
    }    

    res.json({user: user.toObject({getters:true})})
}

const getSavedItems = async(req, res, next)=>{
    const userId = req.params.uId
    let user
    
    try{
        user = await User.findById(userId)
    }catch(err){
        console.log(err)
    }


    let savedItems = user.saved

    res.json(savedItems)

}

const saveItem = async(req, res, next)=>{
    const {type, itemId} = req.body
    

    const uId = req.params.uId

    let user
    try {
        user = await User.findById(uId)
        if(type === "comment"){
            user.saved.savedComments.push(
                {
                    comment: itemId,
                    savedDate: Date()
                }
                    )
        }else if(type === "post"){
            user.saved.savedPosts.push({
                post:itemId,
                savedDate: Date()
            })
        }


    } catch (error) {
        console.log(err)
    }

    try {
        await user.save()
    } catch (error) {
        console.log(error)
    }

    res.json({user: user.toObject({getters:true})})

}



const unsaveItem = async(req, res, next)=>{
    const {type, itemId} = req.body
    const uId = req.params.uId

    let foundItemIndex
    let user

    try {
        user = await User.findById(uId)


        if(type === "comment"){
            foundItemIndex = user.saved.savedComments.findIndex((c) => JSON.stringify(c.comment) === `"${itemId}"`)
            user.saved.savedComments.splice(foundItemIndex, 1)
        }else if(type === "post"){
            foundItemIndex = user.saved.savedPosts.findIndex((p) => JSON.stringify(p.post) === `"${itemId}"`)
            user.saved.savedPosts.splice(foundItemIndex, 1)
        }

    } catch (error) {
        console.log(err)
    }

    try {
        await user.save()
    } catch (error) {
        console.log(error)
    }

    res.json({user: user.toObject({getters:true})})
}


const bioEdit = async(req, res, next)=>{
    let userId = req.params.uId
    let bio = req.body.bio
    let user

    try{
        user = await User.findById(userId)
    }catch(err){
        console.log(err)
    }

    user.bio = bio

    try{
        await user.save()
    }catch(err){
        console.log(err)
    }

    res.json({user: user.toObject({getters:true})})

}

exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById
exports.saveItem = saveItem
exports.getSavedItems = getSavedItems
exports.unsaveItem = unsaveItem
exports.bioEdit = bioEdit
