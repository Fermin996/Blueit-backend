const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{

    try{
        const token = req.header.authorization.split(' ')[1]
        if(!token){
            console.log("error")
        }

        const decodedToken = jwt.verify(token,  process.env.SECRET_STRING)
        req.userData = {userId: decodedToken.userId}
        next()
    }catch(err){
        console.log(err)
    }
    
}