const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    title: { type: String, required: true},
    text: { type: String, required: true},
    user: {type: mongoose.Types.ObjectId, required:true, ref:"User"},
    username:{type:String, required:true},
    comments: [{type: mongoose.Types.ObjectId, ref:"Comment"}],
    post: {type: mongoose.Types.ObjectId, ref:"Post"},
    voteUsers:[
        {userVote:{
            user:{type: mongoose.Types.ObjectId, ref:"User"},
            voteType:{type:String}
        }}
    ],
    votes:{type:Number, required:true},
    sub: {type: mongoose.Types.ObjectId, ref:"Sub"},
    subName: {type:String, required:true},
    date: {type: Date, required:true}
})

module.exports = mongoose.model('Post', postSchema);