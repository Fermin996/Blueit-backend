const validator = require('validator')

module.exports = function validateRegistration(data, isLogin){
    let errors = {
        username: false,
        email: false,
        password: false
    }

    if(isLogin){
        errors.username = false
    }else if(!data.username || !validator.isLength(data.username, {min:6, max:20})){
        errors.username = "Username must be between 6 and 20 characters"
    }

    if(!data.email || !validator.isEmail(data.email)){
        errors.email = "not a valid email address"
    }

    if(!data.password || !validator.isLength(data.password, {min:6, max:30})){
        errors.password = "Password must have between 6 and 30 characters"
    }


    if(errors.password || errors.email || errors.username){
        return {errors, isValid:false}
    }else{
        return {errors:false, isValid:true}
    }

}