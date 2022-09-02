const mongoose = require('mongoose')

const Schema = mongoose.Schema

const subSchema = new Schema({
    subName: {type: String, required: true},
    subInfo:{type: String, required:true},
    memberCount:{type: Number, required: true},
    rules:[{
        title: {type: String},
        description: {type:String}
    }],
    cakeDay: Date
})

module.exports = mongoose.model('Sub', subSchema);