const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    text: {type: String, required: true},
    user: {type: mongoose.Types.ObjectId, required:true, ref:"User"},
    userName: {type: String, required:true},
    comments: [{type: mongoose.Types.ObjectId, required:true, ref:"Comment"}],
    voteUsers:[
        {userVote:{
            user:{type: mongoose.Types.ObjectId, ref:"User"},
            voteType:{type:String}
        }}
    ],
    votes:{type:Number, required:true},
    post:{type: mongoose.Types.ObjectId, ref:"Post"},
    parentComment:{type: mongoose.Types.ObjectId, ref:"Comment"},
    date: {type: Date, required:true}
})

module.exports = mongoose.model('Comment', commentSchema);