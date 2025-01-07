
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const {comparePass} = require("../util/hashingPassword.js");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxLength:32,
        minLength:5,
    },
    lastName:{
        type:String,
        required:true,
        maxLength:32,
        minLength:5,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        lowercase:true,
        validate:[(val)=>{
            return ["male","female","other"].includes(val);
        },"what's your genda?"]
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        index:true,
        validate:[validator.isEmail,"provid a valid email"],
    },
    password: {
        type: String,
        required: true,
        validate:[validator.isStrongPassword,"password is not strong enough"]
    },  
    skills:{
        type:[String],
    },
    photoUrl:{
        type:String,
        validate:[validator.isURL,"provide a url"]
    },
},{ timestamps: true });

userSchema.methods.getJWT = async function (){
    return await jwt.sign({_id:this._id},"varun",{ expiresIn:"7d" });
}

userSchema.methods.isPasswordSame = async function (inputPassword) {
    return await comparePass(inputPassword,this.password);
}
module.exports = mongoose.model("User",userSchema);