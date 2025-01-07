const express = require("express");
const validator = require("validator");
const inputvalidator = require("../util/validate.js");
const {hashPass} = require("../util/hashingPassword.js");
const User = require("../models/user.js")

const authRouter = express.Router();

authRouter.post("/signup",async (req,res)=>{
    //always encapsulate DB operations in try-catch
    try {
        const {firstName,lastName,emailId,password,photoUrl,skills,gender} = inputvalidator(req.body);
       // console.log(firstName);
        const hash = await hashPass(password);
       // const Obj = req.body;
        await User.init();
        const user = new User({
            firstName,
            lastName,
            emailId,
            "password":hash,
            photoUrl,
            skills,
            gender,
        });
        await   user.save();
        res.send("User added successfully");
    } catch (error) {
        res.status(500).send("error "+error);
    }
    // creating new instance of user model
 
});
authRouter.post("/signIn",async (req,res)=>{
    try {
        const {emailId,password} = req.body;
        if(!validator.isEmail(emailId))
        {
            throw new Error("invalid");
        }
        const user = await User.findOne({emailId,},{password:true});
        if(!user)
        {
            throw new Error();
        }
        else{
            //console.log(user);
            const result = await user.isPasswordSame(password);
            //console.log(result);
            if(result)
            {
                const token = await user.getJWT()
                res.cookie("token",token,{maxAge:60480000});
                res.status(200).send("login successful");
            }
            else {
                throw new Error();
            } 
        }
    } catch (error) {
        console.log(error);
        res.status(404).send("Invalid credencials");
    }

})

authRouter.post("./signOut",(req,res)=>{
    res.cookie("token",null,{maxAge:0}).send("Sign out successfully");
})

module.exports = authRouter;