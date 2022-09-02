const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{type: String, required: true},
    bio:{type:String, required:true},
    karma:{type:Number, required: true},
    password:{type: String, required: true, minlength:6},
    email:{type: String, required: true, unique:true},
    posts:[{type: mongoose.Types.ObjectId, required:true, ref:"Post"}],
    comments:[{type: mongoose.Types.ObjectId, required:true, ref:"Comment"}],
    votes:[{type:mongoose.Types.ObjectId, ref:"Post", voteType:String}],
    cakeDay:{type: Date, required: true},
    saved:{
        savedPosts:[
            {
                post:{type: mongoose.Types.ObjectId, required:true, ref:"Post"},
                savedDate:{type:Date, required: true}
            }
        ],
        savedComments:[
            {
                comment:{type: mongoose.Types.ObjectId, required:true, ref:"Comment"},
                savedDate:{type:Date, required:true}
            }
        ]
    }
})


module.exports = mongoose.model('User', userSchema)