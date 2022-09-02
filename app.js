const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
require("dotenv").config()


const postsRoutes = require('./routes/posts-routes')
const userRoutes = require('./routes/user-routes')
const commentsRoutes = require('./routes/comments-routes')
const subRoutes = require('./routes/sub-routes')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    next()
})

app.use('/sub', subRoutes)
app.use('/posts', postsRoutes)
app.use('/user', userRoutes)
app.use('/comments', commentsRoutes)


mongoose
    .connect(
        `mongodb+srv://${process.env.USERNAME}:${process.env.KEY}@cluster0.vzjyi.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
        )
    .then(()=>{
        app.listen(process.env.PORT|| 5000)
    })
    .catch(err => {
        console.log(err)
    })                               